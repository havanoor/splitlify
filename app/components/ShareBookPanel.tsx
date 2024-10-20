import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Share2 } from "lucide-react";
import { Input } from "~/components/ui/input";

type ShareBookProps = {
  typeOfBook: string;
  bookUrl: string;
};
export default function ShareBookPanel({
  typeOfBook,
  bookUrl,
}: ShareBookProps) {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          {typeOfBook === "PUBLIC" ? <Share2 className="w-4 h-4" /> : null}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Book</DialogTitle>
            <DialogDescription>Copy Book URL to clipboard.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={bookUrl} className="col-span-3" disabled />
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(bookUrl);
              }}
            >
              Copy URL
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
