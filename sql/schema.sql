-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.author (
  authorid bigint NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT author_pkey PRIMARY KEY (authorid)
);
CREATE TABLE public.book (
  isbn character varying NOT NULL,
  title character varying NOT NULL,
  publisher character varying,
  pubyear integer,
  language character varying,
  cover text DEFAULT ''::text,
  CONSTRAINT book_pkey PRIMARY KEY (isbn)
);
CREATE TABLE public.bookauthor (
  isbn character varying NOT NULL,
  authorid bigint NOT NULL,
  CONSTRAINT bookauthor_pkey PRIMARY KEY (isbn, authorid),
  CONSTRAINT bookauthor_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.book(isbn),
  CONSTRAINT bookauthor_authorid_fkey FOREIGN KEY (authorid) REFERENCES public.author(authorid)
);
CREATE TABLE public.bookcategory (
  isbn character varying NOT NULL,
  categoryid bigint NOT NULL,
  CONSTRAINT bookcategory_pkey PRIMARY KEY (isbn, categoryid),
  CONSTRAINT bookcategory_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.book(isbn),
  CONSTRAINT bookcategory_categoryid_fkey FOREIGN KEY (categoryid) REFERENCES public.category(categoryid)
);
CREATE TABLE public.bookcopy (
  copyid bigint NOT NULL,
  isbn character varying NOT NULL,
  barcode character varying UNIQUE,
  acquisitiondate date,
  condition character varying,
  location character varying,
  status character varying,
  CONSTRAINT bookcopy_pkey PRIMARY KEY (copyid),
  CONSTRAINT bookcopy_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.book(isbn)
);
CREATE TABLE public.borrowstats (
  isbn character varying NOT NULL,
  yearmonth character NOT NULL,
  borrowcount integer DEFAULT 0,
  CONSTRAINT borrowstats_pkey PRIMARY KEY (isbn, yearmonth),
  CONSTRAINT borrowstats_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.book(isbn)
);
CREATE TABLE public.category (
  categoryid bigint NOT NULL,
  name character varying NOT NULL UNIQUE,
  CONSTRAINT category_pkey PRIMARY KEY (categoryid)
);
CREATE TABLE public.inventoryaction (
  actionid bigint NOT NULL,
  copyid bigint,
  librarianid bigint,
  actiontype character varying,
  actiondate timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes text,
  CONSTRAINT inventoryaction_pkey PRIMARY KEY (actionid),
  CONSTRAINT inventoryaction_copyid_fkey FOREIGN KEY (copyid) REFERENCES public.bookcopy(copyid),
  CONSTRAINT inventoryaction_librarianid_fkey FOREIGN KEY (librarianid) REFERENCES public.librarian(librarianid)
);
CREATE TABLE public.librarian (
  librarianid bigint NOT NULL,
  name character varying NOT NULL,
  email character varying,
  user_id uuid NOT NULL,
  CONSTRAINT librarian_pkey PRIMARY KEY (librarianid),
  CONSTRAINT librarian_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.loan (
  loanid bigint NOT NULL,
  copyid bigint NOT NULL,
  patronid bigint NOT NULL,
  borrowdate date NOT NULL,
  duedate date NOT NULL,
  returndate date,
  renewcount integer DEFAULT 0,
  fineamount numeric DEFAULT 0.00,
  CONSTRAINT loan_pkey PRIMARY KEY (loanid),
  CONSTRAINT loan_copyid_fkey FOREIGN KEY (copyid) REFERENCES public.bookcopy(copyid),
  CONSTRAINT loan_patronid_fkey FOREIGN KEY (patronid) REFERENCES public.patron(patronid)
);
CREATE TABLE public.patron (
  patronid bigint NOT NULL,
  name character varying NOT NULL,
  patrontype character varying NOT NULL,
  email character varying,
  phone character varying,
  address text,
  membershipstart date,
  membershipend date,
  userid uuid NOT NULL,
  CONSTRAINT patron_pkey PRIMARY KEY (patronid),
  CONSTRAINT patron_userid_fkey FOREIGN KEY (userid) REFERENCES auth.users(id)
);
CREATE TABLE public.patrontypepolicy (
  patrontype character varying NOT NULL,
  maxloans integer NOT NULL,
  loanperioddays integer NOT NULL,
  fineperday numeric NOT NULL,
  CONSTRAINT patrontypepolicy_pkey PRIMARY KEY (patrontype)
);
CREATE TABLE public.reservation (
  reservationid bigint NOT NULL,
  isbn character varying NOT NULL,
  patronid bigint NOT NULL,
  requestdate timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status character varying DEFAULT 'waiting'::character varying,
  queueposition integer,
  CONSTRAINT reservation_pkey PRIMARY KEY (reservationid),
  CONSTRAINT reservation_isbn_fkey FOREIGN KEY (isbn) REFERENCES public.book(isbn),
  CONSTRAINT reservation_patronid_fkey FOREIGN KEY (patronid) REFERENCES public.patron(patronid)
);
CREATE TABLE public.tasks (
  taskid bigint,
  title text,
  duedate timestamp without time zone,
  status text,
  userid bigint NOT NULL,
  CONSTRAINT tasks_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id)
);
CREATE TABLE public.test (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT test_pkey PRIMARY KEY (id)
);
CREATE TABLE public.todos (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  task text CHECK (char_length(task) > 3),
  is_complete boolean DEFAULT false,
  inserted_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT todos_pkey PRIMARY KEY (id),
  CONSTRAINT todos_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.tuser (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  CONSTRAINT tuser_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  name text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);