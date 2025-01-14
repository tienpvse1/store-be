-- migrate:up
CREATE TABLE public.role (
  name TEXT PRIMARY KEY
);

INSERT INTO public.role (name) values ('user'), ('admin');


CREATE TABLE public.user (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  is_active boolean DEFAULT false
);

CREATE TABLE public.user_role (
  role_name TEXT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY(role_name, user_id),
  CONSTRAINT role_fk FOREIGN KEY(role_name) REFERENCES public.role(name),
  CONSTRAINT user_fk FOREIGN KEY (user_id)
    REFERENCES public.user(id)
);

-- migrate:down
DROP TABLE public.user_role;
DROP TABLE public.user;
DROP TABLE public.role;
