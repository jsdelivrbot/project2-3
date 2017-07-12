--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.3
-- Dumped by pg_dump version 9.6.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: album; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE album (
    id integer NOT NULL,
    name text NOT NULL,
    owner_id integer NOT NULL,
    shared boolean NOT NULL
);


ALTER TABLE album OWNER TO postgres;

--
-- Name: album_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE album_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE album_id_seq OWNER TO postgres;

--
-- Name: album_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE album_id_seq OWNED BY album.id;


--
-- Name: albumimg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE albumimg (
    id integer NOT NULL,
    photo_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE albumimg OWNER TO postgres;

--
-- Name: albumimg_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE albumimg_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE albumimg_id_seq OWNER TO postgres;

--
-- Name: albumimg_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE albumimg_id_seq OWNED BY albumimg.id;


--
-- Name: photo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE photo (
    id integer NOT NULL,
    url text NOT NULL,
    "dec" text NOT NULL,
    owner_id integer NOT NULL,
    shared boolean NOT NULL,
    photoname text NOT NULL
);


ALTER TABLE photo OWNER TO postgres;

--
-- Name: photo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE photo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE photo_id_seq OWNER TO postgres;

--
-- Name: photo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE photo_id_seq OWNED BY photo.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id integer NOT NULL,
    name text NOT NULL,
    username text,
    email text NOT NULL,
    password text,
    gid text,
    fid text
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: album id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY album ALTER COLUMN id SET DEFAULT nextval('album_id_seq'::regclass);


--
-- Name: albumimg id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY albumimg ALTER COLUMN id SET DEFAULT nextval('albumimg_id_seq'::regclass);


--
-- Name: photo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY photo ALTER COLUMN id SET DEFAULT nextval('photo_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: album; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY album (id, name, owner_id, shared) FROM stdin;
\.


--
-- Name: album_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('album_id_seq', 1, false);


--
-- Data for Name: albumimg; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY albumimg (id, photo_id, user_id) FROM stdin;
\.


--
-- Name: albumimg_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('albumimg_id_seq', 1, false);


--
-- Data for Name: photo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY photo (id, url, "dec", owner_id, shared, photoname) FROM stdin;
10	pexels-photo.jpeg	stuff	7	f	photo
11	pexels-photo (1).jpeg	stuff	7	f	photo
12	pexels-photo-186621.jpeg	stuff	7	f	photo
13	pexels-photo-196464.jpeg	stuff	7	f	photo
14	pexels-photo-299843.jpeg	stuff	7	f	photo
15	pexels-photo-346885.jpeg	stuff	7	f	photo
16	pexels-photo-374633.jpeg	stuff	7	f	photo
17	pexels-photo-117475.jpeg	stuff	7	f	photo
21	pexels-photo-40136.jpeg	old car	7	f	car
22	pexels-photo-196177.jpeg	leppered	7	f	cat
\.


--
-- Name: photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('photo_id_seq', 22, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (id, name, username, email, password, gid, fid) FROM stdin;
2	jmp	thejmp	jmp@thejmpo.com	sha1$42450b60$1$4ac56e2d669ba0c632831367300b698f6277624a	\N	\N
3	joshuapattullo	jmp	jmp@jmp.tech	sha1$9c236d6e$1$089466cbf931d14d463bd5e82ae427ef16031963	\N	\N
4	joshua	jmps	jm@m.com	$2a$10$6eRe8SpfjUw6Vjus56tNjOkua8LLQZNYx8BshXA4ZzFkUOI3L.g2G	\N	\N
7	Joshua Pattullo	\N	jmpattullo94@gmail.com	\N	113582380816122649305	\N
8	Joshua M Pattullo	\N	pattullojoshua1@gmail.com	\N	\N	10214130854809199
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('users_id_seq', 48, true);


--
-- Name: album album_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY album
    ADD CONSTRAINT album_pkey PRIMARY KEY (id);


--
-- Name: albumimg albumimg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY albumimg
    ADD CONSTRAINT albumimg_pkey PRIMARY KEY (id);


--
-- Name: photo photo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY photo
    ADD CONSTRAINT photo_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_email_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_uindex ON users USING btree (email);


--
-- Name: users_username_uindex; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username_uindex ON users USING btree (username);


--
-- Name: album album_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY album
    ADD CONSTRAINT album_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id);


--
-- Name: albumimg albumimg_photo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY albumimg
    ADD CONSTRAINT albumimg_photo_id_fkey FOREIGN KEY (photo_id) REFERENCES album(id);


--
-- Name: albumimg albumimg_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY albumimg
    ADD CONSTRAINT albumimg_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: photo photo_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY photo
    ADD CONSTRAINT photo_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--

