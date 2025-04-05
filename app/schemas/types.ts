type Transaction = {
  amount: number;
  desc: string;
  date: string;
  book_id: number;
  payer_id: number;
  id: number;
  payer: User;
  payee: User[];
  category: Category | null;
};

type TransactionSummary = {
  total_amount: number;
  total_transactions: number;
  transactions: Transaction[];
};

type NewTransaction = {
  amount: number;
  desc: string;
  date: string | null;
  book_id: string | null;
  payer_id: string | null;
  payee_ids: string[] | null;
  category_id: string | null;
};

type UpdateTransaction = {
  id: number;
  amount: number;
  desc: string;
  date: string | null;
  book_id: string | null;
  payer_id: string | null;
  payee_ids: string[] | null;
  category_id: string | null;
};

type User = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  id: number;
};

type Category = {
  category: string;
  id: number;
};

type NewUser = {
  first_name: string;
  last_name: string | null;
  username: string | null;
  book_id: string;
};

type Book = {
  name: string;
  user_id: number;
  id: number;
  type_of_book: string;
  users: User;
  book_currency: string;
  // transactions: Transaction[];
  splitters: User[];
};

type NewBook = {
  name: string;
  user_id: string;
  book_currency: string;
  type_of_book: string;
};

type Payment = {
  payer: string;
  payee: string;
  amount: number;
};
interface Splits {
  splits: Payment[];
}

type State = {
  amount: number;
  transactions: Transaction[] | null;
  splits: Splits | null;
  books: Book | null;
};
