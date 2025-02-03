-- migrate:up
CREATE TABLE public.otp (
  id TEXT UNIQUE PRIMARY KEY, 
  user_id INT,
  created_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  CONSTRAINT user_fk FOREIGN KEY (user_id)
    REFERENCES public.user(id)
);

-- migrate:down
DROP TABLE public.otp;

