import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

import { useFetcher } from "@remix-run/react";
import { ChangeEvent, useState, useEffect } from "react";
import { useDebounce } from "~/customHooks/Debounce";
import { X } from "lucide-react";

type userProps = {
  bookId: string;
  splitters?: User[];
};

export default function AddNewPerson({ bookId, splitters }: userProps) {
  const [currentUsername, setCurrentUsername] = useState("");
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();

  const debounceUsername = useDebounce(currentUsername);
  const validUsername = useFetcher();
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "found" | "not_found">("idle");

  useEffect(() => {
    if (debounceUsername.trim() !== "") {
      validUsername.load(`/valid-username/${debounceUsername}`);
      setUsernameStatus("checking");
    } else {
      setUsernameStatus("idle");
    }
  }, [debounceUsername]);

  useEffect(() => {
    if (!debounceUsername.trim()) return;
    if (validUsername.state === "loading") {
      setUsernameStatus("checking");
    } else if (validUsername.data === false) {
      // false = username is taken = user EXISTS in the system ✓
      setUsernameStatus("found");
    } else if (validUsername.data === true) {
      // true = username is available = user NOT found ✗
      setUsernameStatus("not_found");
    }
  }, [validUsername.data, validUsername.state]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && (fetcher.data as any).ok) {
      setOpen(false);
      setCurrentUsername("");
      setUsernameStatus("idle");
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <div className="w-full">
      {!open ? (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          variant="outline"
          className="w-full text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary border-dashed rounded-xl h-12 transition-all mt-2"
        >
          + Add New Person
        </Button>
      ) : (
        <div className="bg-muted/30 p-4 rounded-xl border border-border mt-2 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setOpen(false);
              setCurrentUsername("");
              setUsernameStatus("idle");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="grid gap-4 mt-1">
            <div className="space-y-1 pb-2 border-b border-border/50">
              <h4 className="font-bold text-base text-foreground">New Participant</h4>
              <p className="text-xs text-muted-foreground">
                Add someone to split expenses with.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="participant" className="text-sm font-semibold text-foreground/80">Participant Name or Username</Label>
              <Input
                id="participant"
                value={currentUsername}
                onChange={(e) => setCurrentUsername(e.target.value)}
                placeholder="Enter username"
                className={`h-10 rounded-xl focus-visible:ring-primary transition-colors ${
                  usernameStatus === "found"
                    ? "border-primary"
                    : usernameStatus === "not_found"
                    ? "border-amber-400"
                    : "border-input"
                }`}
              />
              
              {currentUsername.trim() && usernameStatus !== "idle" && (
                <p className={`text-xs font-medium ${
                  usernameStatus === "found"
                    ? "text-primary"
                    : usernameStatus === "checking"
                    ? "text-info"
                    : "text-amber-500"
                }`}>
                  {usernameStatus === "checking" && `Checking "${debounceUsername}"...`}
                  {usernameStatus === "found" && `✓ User "${debounceUsername}" found`}
                  {usernameStatus === "not_found" && `"${debounceUsername}" will be added as a placeholder`}
                </p>
              )}
            </div>

            {splitters && splitters.length > 0 && (
              <div className="space-y-2 mt-2">
                <Label className="text-xs font-semibold text-foreground/80">Current Participants</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {splitters.map((u) => {
                    const name = u.username || u.first_name || u.id;
                    const isReal = !!u.username; // simplistic check, matching editbook
                    return (
                      <span key={u.id} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${
                        isReal
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-amber-50 text-warning border-amber-200"
                      }`}>
                        {name}
                        {!isReal && <span className="font-normal opacity-60 ml-0.5"> </span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="flex gap-2 mt-5">
              <Button
                type="button"
                onClick={() => {
                  const formData = new FormData();
                  formData.append("_action", "AddNewUser");
                  formData.append("book_id", bookId);
                  
                  if (usernameStatus === "found") {
                    formData.append("username", currentUsername.trim());
                  } else {
                    formData.append("first_name", currentUsername.trim());
                  }
                  
                  fetcher.submit(formData, { method: "POST" });
                }}
                className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-sm"
                disabled={
                  fetcher.state === "submitting" ||
                  !currentUsername.trim() ||
                  usernameStatus === "checking"
                }
              >
                {fetcher.state === "submitting" ? "Adding..." : "Add Person"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
