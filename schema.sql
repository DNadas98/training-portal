--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: answer; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.answer (
    id bigint NOT NULL,
    answer_order integer NOT NULL,
    correct boolean NOT NULL,
    text character varying(300) NOT NULL,
    question_id bigint NOT NULL
);


ALTER TABLE public.answer OWNER TO trainingportaluser;

--
-- Name: answer_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.answer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.answer_id_seq OWNER TO trainingportaluser;

--
-- Name: answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.answer_id_seq OWNED BY public.answer.id;


--
-- Name: application_user; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.application_user (
    id bigint NOT NULL,
    credentials_expired boolean NOT NULL,
    current_coordinator_full_name character varying(255),
    data_preparator_full_name character varying(255),
    email character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    expired boolean NOT NULL,
    full_name character varying(255) NOT NULL,
    global_roles character varying(255)[],
    has_external_test_failure boolean,
    has_external_test_questionnaire boolean,
    locked boolean NOT NULL,
    password character varying(255) NOT NULL,
    received_successful_completion_email boolean NOT NULL,
    username character varying(255) NOT NULL,
    active_questionnaire_id bigint
);


ALTER TABLE public.application_user OWNER TO trainingportaluser;

--
-- Name: application_user_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.application_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.application_user_id_seq OWNER TO trainingportaluser;

--
-- Name: application_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.application_user_id_seq OWNED BY public.application_user.id;


--
-- Name: email_change_verification_token; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.email_change_verification_token (
    id bigint NOT NULL,
    created_at timestamp(6) with time zone,
    expires_at timestamp(6) with time zone NOT NULL,
    token_type character varying(255) NOT NULL,
    verification_code_hash character varying(255) NOT NULL,
    new_email character varying(255) NOT NULL,
    user_id bigint NOT NULL,
    CONSTRAINT email_change_verification_token_token_type_check CHECK (((token_type)::text = ANY ((ARRAY['REGISTRATION'::character varying, 'PRE_REGISTRATION'::character varying, 'EMAIL_CHANGE'::character varying, 'PASSWORD_RESET'::character varying])::text[])))
);


ALTER TABLE public.email_change_verification_token OWNER TO trainingportaluser;

--
-- Name: group_admins; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.group_admins (
    group_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.group_admins OWNER TO trainingportaluser;

--
-- Name: group_editors; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.group_editors (
    group_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.group_editors OWNER TO trainingportaluser;

--
-- Name: group_inactive_members; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.group_inactive_members (
    group_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.group_inactive_members OWNER TO trainingportaluser;

--
-- Name: group_join_request; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.group_join_request (
    id bigint NOT NULL,
    created_at timestamp(6) with time zone,
    status character varying(255),
    updated_at timestamp(6) with time zone,
    user_id bigint,
    group_id bigint,
    CONSTRAINT group_join_request_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'DECLINED'::character varying])::text[])))
);


ALTER TABLE public.group_join_request OWNER TO trainingportaluser;

--
-- Name: group_join_request_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.group_join_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.group_join_request_id_seq OWNER TO trainingportaluser;

--
-- Name: group_join_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.group_join_request_id_seq OWNED BY public.group_join_request.id;


--
-- Name: group_members; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.group_members (
    group_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.group_members OWNER TO trainingportaluser;

--
-- Name: password_reset_verification_token; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.password_reset_verification_token (
    id bigint NOT NULL,
    created_at timestamp(6) with time zone,
    expires_at timestamp(6) with time zone NOT NULL,
    token_type character varying(255) NOT NULL,
    verification_code_hash character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    CONSTRAINT password_reset_verification_token_token_type_check CHECK (((token_type)::text = ANY ((ARRAY['REGISTRATION'::character varying, 'PRE_REGISTRATION'::character varying, 'EMAIL_CHANGE'::character varying, 'PASSWORD_RESET'::character varying])::text[])))
);


ALTER TABLE public.password_reset_verification_token OWNER TO trainingportaluser;

--
-- Name: pre_registration_verification_token; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.pre_registration_verification_token (
    id bigint NOT NULL,
    created_at timestamp(6) with time zone,
    expires_at timestamp(6) with time zone NOT NULL,
    token_type character varying(255) NOT NULL,
    verification_code_hash character varying(255) NOT NULL,
    current_coordinator_full_name character varying(255),
    data_preparator_full_name character varying(255),
    email character varying(255) NOT NULL,
    full_name character varying(255),
    group_id bigint NOT NULL,
    has_external_test_failure boolean,
    has_external_test_questionnaire boolean,
    project_id bigint NOT NULL,
    questionnaire_id bigint NOT NULL,
    username character varying(255) NOT NULL,
    CONSTRAINT pre_registration_verification_token_token_type_check CHECK (((token_type)::text = ANY ((ARRAY['REGISTRATION'::character varying, 'PRE_REGISTRATION'::character varying, 'EMAIL_CHANGE'::character varying, 'PASSWORD_RESET'::character varying])::text[])))
);


ALTER TABLE public.pre_registration_verification_token OWNER TO trainingportaluser;

--
-- Name: project; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.project (
    id bigint NOT NULL,
    created_at timestamp(6) with time zone,
    deadline timestamp(6) with time zone NOT NULL,
    description character varying(255) NOT NULL,
    detailed_description character varying(10000) NOT NULL,
    name character varying(255) NOT NULL,
    start_date timestamp(6) with time zone NOT NULL,
    updated_at timestamp(6) with time zone,
    created_by_user_id bigint,
    updated_by_user_id bigint,
    group_id bigint
);


ALTER TABLE public.project OWNER TO trainingportaluser;

--
-- Name: project_admins; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.project_admins (
    project_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.project_admins OWNER TO trainingportaluser;

--
-- Name: project_assigned_members; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.project_assigned_members (
    project_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.project_assigned_members OWNER TO trainingportaluser;

--
-- Name: project_coordinators; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.project_coordinators (
    project_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.project_coordinators OWNER TO trainingportaluser;

--
-- Name: project_editors; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.project_editors (
    project_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.project_editors OWNER TO trainingportaluser;

--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_id_seq OWNER TO trainingportaluser;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: project_inactive_members; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.project_inactive_members (
    project_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.project_inactive_members OWNER TO trainingportaluser;

--
-- Name: project_join_request; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.project_join_request (
    id bigint NOT NULL,
    created_at timestamp(6) with time zone,
    status character varying(255),
    updated_at timestamp(6) with time zone,
    user_id bigint,
    project_id bigint,
    CONSTRAINT project_join_request_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'DECLINED'::character varying])::text[])))
);


ALTER TABLE public.project_join_request OWNER TO trainingportaluser;

--
-- Name: project_join_request_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.project_join_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_join_request_id_seq OWNER TO trainingportaluser;

--
-- Name: project_join_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.project_join_request_id_seq OWNED BY public.project_join_request.id;


--
-- Name: question; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.question (
    id bigint NOT NULL,
    points integer NOT NULL,
    question_order integer NOT NULL,
    text character varying(3000) NOT NULL,
    type character varying(255) NOT NULL,
    questionnaire_id bigint NOT NULL,
    CONSTRAINT question_type_check CHECK (((type)::text = ANY ((ARRAY['RADIO'::character varying, 'CHECKBOX'::character varying])::text[])))
);


ALTER TABLE public.question OWNER TO trainingportaluser;

--
-- Name: question_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.question_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.question_id_seq OWNER TO trainingportaluser;

--
-- Name: question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.question_id_seq OWNED BY public.question.id;


--
-- Name: questionnaire; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.questionnaire (
    id bigint NOT NULL,
    activated boolean NOT NULL,
    created_at timestamp(6) with time zone,
    description character varying(3000) NOT NULL,
    max_points integer,
    name character varying(100) NOT NULL,
    status character varying(255) NOT NULL,
    updated_at timestamp(6) with time zone,
    created_by_user_id bigint,
    project_id bigint NOT NULL,
    updated_by_user_id bigint,
    CONSTRAINT questionnaire_status_check CHECK (((status)::text = ANY ((ARRAY['TEST'::character varying, 'ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


ALTER TABLE public.questionnaire OWNER TO trainingportaluser;

--
-- Name: questionnaire_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.questionnaire_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.questionnaire_id_seq OWNER TO trainingportaluser;

--
-- Name: questionnaire_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.questionnaire_id_seq OWNED BY public.questionnaire.id;


--
-- Name: questionnaire_submission; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.questionnaire_submission (
    id bigint NOT NULL,
    created_at timestamp(6) with time zone,
    max_points integer NOT NULL,
    received_points integer NOT NULL,
    status character varying(255) NOT NULL,
    questionnaire_id bigint NOT NULL,
    user_id bigint NOT NULL,
    CONSTRAINT questionnaire_submission_status_check CHECK (((status)::text = ANY ((ARRAY['TEST'::character varying, 'ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


ALTER TABLE public.questionnaire_submission OWNER TO trainingportaluser;

--
-- Name: questionnaire_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.questionnaire_submission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.questionnaire_submission_id_seq OWNER TO trainingportaluser;

--
-- Name: questionnaire_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.questionnaire_submission_id_seq OWNED BY public.questionnaire_submission.id;


--
-- Name: registration_token; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.registration_token (
    id bigint NOT NULL,
    created_at timestamp(6) with time zone,
    expires_at timestamp(6) with time zone NOT NULL,
    token_type character varying(255) NOT NULL,
    verification_code_hash character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    CONSTRAINT registration_token_token_type_check CHECK (((token_type)::text = ANY ((ARRAY['REGISTRATION'::character varying, 'PRE_REGISTRATION'::character varying, 'EMAIL_CHANGE'::character varying, 'PASSWORD_RESET'::character varying])::text[])))
);


ALTER TABLE public.registration_token OWNER TO trainingportaluser;

--
-- Name: submitted_answer; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.submitted_answer (
    id bigint NOT NULL,
    answer_order integer NOT NULL,
    status character varying(255) NOT NULL,
    text character varying(300) NOT NULL,
    submitted_question_id bigint NOT NULL,
    CONSTRAINT submitted_answer_status_check CHECK (((status)::text = ANY ((ARRAY['CORRECT'::character varying, 'INCORRECT'::character varying, 'UNCHECKED'::character varying])::text[])))
);


ALTER TABLE public.submitted_answer OWNER TO trainingportaluser;

--
-- Name: submitted_answer_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.submitted_answer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.submitted_answer_id_seq OWNER TO trainingportaluser;

--
-- Name: submitted_answer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.submitted_answer_id_seq OWNED BY public.submitted_answer.id;


--
-- Name: submitted_question; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.submitted_question (
    id bigint NOT NULL,
    max_points integer NOT NULL,
    question_order integer NOT NULL,
    received_points integer NOT NULL,
    text character varying(10000) NOT NULL,
    type character varying(255) NOT NULL,
    questionnaire_submission_id bigint NOT NULL,
    CONSTRAINT submitted_question_type_check CHECK (((type)::text = ANY ((ARRAY['RADIO'::character varying, 'CHECKBOX'::character varying])::text[])))
);


ALTER TABLE public.submitted_question OWNER TO trainingportaluser;

--
-- Name: submitted_question_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.submitted_question_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.submitted_question_id_seq OWNER TO trainingportaluser;

--
-- Name: submitted_question_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.submitted_question_id_seq OWNED BY public.submitted_question.id;


--
-- Name: task; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.task (
    id bigint NOT NULL,
    deadline timestamp(6) with time zone NOT NULL,
    description character varying(255) NOT NULL,
    difficulty integer NOT NULL,
    importance character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    start_date timestamp(6) with time zone NOT NULL,
    task_status character varying(255) NOT NULL,
    project_id bigint,
    CONSTRAINT task_importance_check CHECK (((importance)::text = ANY ((ARRAY['MUST_HAVE'::character varying, 'NICE_TO_HAVE'::character varying])::text[]))),
    CONSTRAINT task_task_status_check CHECK (((task_status)::text = ANY ((ARRAY['BACKLOG'::character varying, 'IN_PROGRESS'::character varying, 'DONE'::character varying, 'FAILED'::character varying])::text[])))
);


ALTER TABLE public.task OWNER TO trainingportaluser;

--
-- Name: task_assigned_members; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.task_assigned_members (
    task_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.task_assigned_members OWNER TO trainingportaluser;

--
-- Name: task_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.task_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_id_seq OWNER TO trainingportaluser;

--
-- Name: task_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.task_id_seq OWNED BY public.task.id;


--
-- Name: token_group_permissions; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.token_group_permissions (
    token_id bigint NOT NULL,
    permission character varying(255) NOT NULL,
    CONSTRAINT token_group_permissions_permission_check CHECK (((permission)::text = ANY ((ARRAY['GROUP_ADMIN'::character varying, 'GROUP_EDITOR'::character varying, 'GROUP_MEMBER'::character varying, 'PROJECT_ADMIN'::character varying, 'PROJECT_EDITOR'::character varying, 'PROJECT_ASSIGNED_MEMBER'::character varying, 'PROJECT_COORDINATOR'::character varying, 'TASK_ASSIGNED_MEMBER'::character varying])::text[])))
);


ALTER TABLE public.token_group_permissions OWNER TO trainingportaluser;

--
-- Name: token_project_permissions; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.token_project_permissions (
    token_id bigint NOT NULL,
    permission character varying(255) NOT NULL,
    CONSTRAINT token_project_permissions_permission_check CHECK (((permission)::text = ANY ((ARRAY['GROUP_ADMIN'::character varying, 'GROUP_EDITOR'::character varying, 'GROUP_MEMBER'::character varying, 'PROJECT_ADMIN'::character varying, 'PROJECT_EDITOR'::character varying, 'PROJECT_ASSIGNED_MEMBER'::character varying, 'PROJECT_COORDINATOR'::character varying, 'TASK_ASSIGNED_MEMBER'::character varying])::text[])))
);


ALTER TABLE public.token_project_permissions OWNER TO trainingportaluser;

--
-- Name: user_group; Type: TABLE; Schema: public; Owner: trainingportaluser
--

CREATE TABLE public.user_group (
    id bigint NOT NULL,
    created_at timestamp(6) with time zone,
    description character varying(255) NOT NULL,
    detailed_description character varying(10000) NOT NULL,
    name character varying(255),
    updated_at timestamp(6) with time zone,
    created_by_user_id bigint,
    updated_by_user_id bigint
);


ALTER TABLE public.user_group OWNER TO trainingportaluser;

--
-- Name: user_group_id_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.user_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_group_id_seq OWNER TO trainingportaluser;

--
-- Name: user_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: trainingportaluser
--

ALTER SEQUENCE public.user_group_id_seq OWNED BY public.user_group.id;


--
-- Name: verification_token_seq; Type: SEQUENCE; Schema: public; Owner: trainingportaluser
--

CREATE SEQUENCE public.verification_token_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_token_seq OWNER TO trainingportaluser;

--
-- Name: answer id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.answer ALTER COLUMN id SET DEFAULT nextval('public.answer_id_seq'::regclass);


--
-- Name: application_user id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.application_user ALTER COLUMN id SET DEFAULT nextval('public.application_user_id_seq'::regclass);


--
-- Name: group_join_request id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_join_request ALTER COLUMN id SET DEFAULT nextval('public.group_join_request_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: project_join_request id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_join_request ALTER COLUMN id SET DEFAULT nextval('public.project_join_request_id_seq'::regclass);


--
-- Name: question id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.question ALTER COLUMN id SET DEFAULT nextval('public.question_id_seq'::regclass);


--
-- Name: questionnaire id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire ALTER COLUMN id SET DEFAULT nextval('public.questionnaire_id_seq'::regclass);


--
-- Name: questionnaire_submission id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire_submission ALTER COLUMN id SET DEFAULT nextval('public.questionnaire_submission_id_seq'::regclass);


--
-- Name: submitted_answer id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.submitted_answer ALTER COLUMN id SET DEFAULT nextval('public.submitted_answer_id_seq'::regclass);


--
-- Name: submitted_question id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.submitted_question ALTER COLUMN id SET DEFAULT nextval('public.submitted_question_id_seq'::regclass);


--
-- Name: task id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.task ALTER COLUMN id SET DEFAULT nextval('public.task_id_seq'::regclass);


--
-- Name: user_group id; Type: DEFAULT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.user_group ALTER COLUMN id SET DEFAULT nextval('public.user_group_id_seq'::regclass);


--
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);


--
-- Name: application_user application_user_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.application_user
    ADD CONSTRAINT application_user_pkey PRIMARY KEY (id);


--
-- Name: email_change_verification_token email_change_verification_token_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.email_change_verification_token
    ADD CONSTRAINT email_change_verification_token_pkey PRIMARY KEY (id);


--
-- Name: group_join_request group_join_request_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_join_request
    ADD CONSTRAINT group_join_request_pkey PRIMARY KEY (id);


--
-- Name: password_reset_verification_token password_reset_verification_token_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.password_reset_verification_token
    ADD CONSTRAINT password_reset_verification_token_pkey PRIMARY KEY (id);


--
-- Name: pre_registration_verification_token pre_registration_verification_token_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.pre_registration_verification_token
    ADD CONSTRAINT pre_registration_verification_token_pkey PRIMARY KEY (id);


--
-- Name: project_join_request project_join_request_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_join_request
    ADD CONSTRAINT project_join_request_pkey PRIMARY KEY (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: question question_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);


--
-- Name: questionnaire questionnaire_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire
    ADD CONSTRAINT questionnaire_pkey PRIMARY KEY (id);


--
-- Name: questionnaire_submission questionnaire_submission_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire_submission
    ADD CONSTRAINT questionnaire_submission_pkey PRIMARY KEY (id);


--
-- Name: registration_token registration_token_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.registration_token
    ADD CONSTRAINT registration_token_pkey PRIMARY KEY (id);


--
-- Name: submitted_answer submitted_answer_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.submitted_answer
    ADD CONSTRAINT submitted_answer_pkey PRIMARY KEY (id);


--
-- Name: submitted_question submitted_question_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.submitted_question
    ADD CONSTRAINT submitted_question_pkey PRIMARY KEY (id);


--
-- Name: task task_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);


--
-- Name: token_group_permissions token_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.token_group_permissions
    ADD CONSTRAINT token_group_permissions_pkey PRIMARY KEY (token_id, permission);


--
-- Name: token_project_permissions token_project_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.token_project_permissions
    ADD CONSTRAINT token_project_permissions_pkey PRIMARY KEY (token_id, permission);


--
-- Name: pre_registration_verification_token uk_2wn8h0teaexw04r72x18dhtwi; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.pre_registration_verification_token
    ADD CONSTRAINT uk_2wn8h0teaexw04r72x18dhtwi UNIQUE (username);


--
-- Name: pre_registration_verification_token uk_5830lqo8et5lowlfop0bsvrbm; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.pre_registration_verification_token
    ADD CONSTRAINT uk_5830lqo8et5lowlfop0bsvrbm UNIQUE (email);


--
-- Name: application_user uk_6c0v0rco93sykgyetukfmkkod; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.application_user
    ADD CONSTRAINT uk_6c0v0rco93sykgyetukfmkkod UNIQUE (username);


--
-- Name: application_user uk_cb61p28hanadv7k0nx1ec0n5l; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.application_user
    ADD CONSTRAINT uk_cb61p28hanadv7k0nx1ec0n5l UNIQUE (email);


--
-- Name: email_change_verification_token uk_j7ltmaj67a4190wgdexkq2uj5; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.email_change_verification_token
    ADD CONSTRAINT uk_j7ltmaj67a4190wgdexkq2uj5 UNIQUE (new_email);


--
-- Name: password_reset_verification_token uk_jm9r3usrviq2e7s8k8cwsj09; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.password_reset_verification_token
    ADD CONSTRAINT uk_jm9r3usrviq2e7s8k8cwsj09 UNIQUE (email);


--
-- Name: user_group uk_kas9w8ead0ska5n3csefp2bpp; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT uk_kas9w8ead0ska5n3csefp2bpp UNIQUE (name);


--
-- Name: registration_token uk_odecv1use2h4kd7puvfvrujk5; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.registration_token
    ADD CONSTRAINT uk_odecv1use2h4kd7puvfvrujk5 UNIQUE (email);


--
-- Name: questionnaire uk_qv1djdsxb2qjvb88k5rgjgqye; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire
    ADD CONSTRAINT uk_qv1djdsxb2qjvb88k5rgjgqye UNIQUE (name);


--
-- Name: email_change_verification_token uk_saql6i7po9mr2apehmw6opcn4; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.email_change_verification_token
    ADD CONSTRAINT uk_saql6i7po9mr2apehmw6opcn4 UNIQUE (user_id);


--
-- Name: registration_token uk_swy9vfxg26e6jgunmskvqq776; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.registration_token
    ADD CONSTRAINT uk_swy9vfxg26e6jgunmskvqq776 UNIQUE (username);


--
-- Name: registration_token uk_tolepru3j2pew3l53mj5cjrou; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.registration_token
    ADD CONSTRAINT uk_tolepru3j2pew3l53mj5cjrou UNIQUE (full_name);


--
-- Name: user_group user_group_pkey; Type: CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT user_group_pkey PRIMARY KEY (id);


--
-- Name: project_admins fk1a6adk9l8l4p91p6f2rx7i7u3; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_admins
    ADD CONSTRAINT fk1a6adk9l8l4p91p6f2rx7i7u3 FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: project_inactive_members fk1h4hxrhi0j0q27dumcyv6klhy; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_inactive_members
    ADD CONSTRAINT fk1h4hxrhi0j0q27dumcyv6klhy FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: questionnaire fk26n3j7d6edanj9od0qgtxjyn; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire
    ADD CONSTRAINT fk26n3j7d6edanj9od0qgtxjyn FOREIGN KEY (updated_by_user_id) REFERENCES public.application_user(id);


--
-- Name: group_editors fk2acgljq6daob9m1q7doff6xax; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_editors
    ADD CONSTRAINT fk2acgljq6daob9m1q7doff6xax FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: task_assigned_members fk3i8374taf7m80xjn7rpuvb8nb; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.task_assigned_members
    ADD CONSTRAINT fk3i8374taf7m80xjn7rpuvb8nb FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: project_inactive_members fk3pif3beu2upmusk1ycocl8a5c; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_inactive_members
    ADD CONSTRAINT fk3pif3beu2upmusk1ycocl8a5c FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: project fk3yjxa4p5jfbq434q9xioejjy1; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk3yjxa4p5jfbq434q9xioejjy1 FOREIGN KEY (group_id) REFERENCES public.user_group(id);


--
-- Name: project fk42ammq1uk49lo7rye2qqyit85; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fk42ammq1uk49lo7rye2qqyit85 FOREIGN KEY (updated_by_user_id) REFERENCES public.application_user(id);


--
-- Name: questionnaire_submission fk4kjajk89stt9p1273fktrus3r; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire_submission
    ADD CONSTRAINT fk4kjajk89stt9p1273fktrus3r FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: question fk5a4p6bl440c9amsq08rs546wu; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT fk5a4p6bl440c9amsq08rs546wu FOREIGN KEY (questionnaire_id) REFERENCES public.questionnaire(id);


--
-- Name: group_join_request fk64xe0hji40q3ub7ikt7nspn5w; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_join_request
    ADD CONSTRAINT fk64xe0hji40q3ub7ikt7nspn5w FOREIGN KEY (group_id) REFERENCES public.user_group(id);


--
-- Name: answer fk8frr4bcabmmeyyu60qt7iiblo; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT fk8frr4bcabmmeyyu60qt7iiblo FOREIGN KEY (question_id) REFERENCES public.question(id);


--
-- Name: group_members fka0rnvuit5l8opskad2n72w9ki; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT fka0rnvuit5l8opskad2n72w9ki FOREIGN KEY (group_id) REFERENCES public.user_group(id);


--
-- Name: application_user fkaafrd0jug5reyd2jl9v5put62; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.application_user
    ADD CONSTRAINT fkaafrd0jug5reyd2jl9v5put62 FOREIGN KEY (active_questionnaire_id) REFERENCES public.questionnaire(id);


--
-- Name: group_inactive_members fkd9up2akcioaja5iyp1btcpqk8; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_inactive_members
    ADD CONSTRAINT fkd9up2akcioaja5iyp1btcpqk8 FOREIGN KEY (group_id) REFERENCES public.user_group(id);


--
-- Name: group_members fkeckhporpr04duul8665vx7gbs; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT fkeckhporpr04duul8665vx7gbs FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: project_assigned_members fker2igvkq2vjqoel4sfa1kr3vb; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_assigned_members
    ADD CONSTRAINT fker2igvkq2vjqoel4sfa1kr3vb FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: group_admins fkg4ftgkkyfxxspc7awkgisuti7; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_admins
    ADD CONSTRAINT fkg4ftgkkyfxxspc7awkgisuti7 FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: group_editors fkgmcjmfr9sx5sbgmg33o9nl0d8; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_editors
    ADD CONSTRAINT fkgmcjmfr9sx5sbgmg33o9nl0d8 FOREIGN KEY (group_id) REFERENCES public.user_group(id);


--
-- Name: task_assigned_members fkhdwiw1cnmdtcnmoxa4s5h3pam; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.task_assigned_members
    ADD CONSTRAINT fkhdwiw1cnmdtcnmoxa4s5h3pam FOREIGN KEY (task_id) REFERENCES public.task(id);


--
-- Name: project_assigned_members fki5b3w6rytrqk14r93qm13tgjx; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_assigned_members
    ADD CONSTRAINT fki5b3w6rytrqk14r93qm13tgjx FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: project_admins fkippwu6at2xkvfk6ldjv3997ll; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_admins
    ADD CONSTRAINT fkippwu6at2xkvfk6ldjv3997ll FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: submitted_question fkj2w5yyp7hiaq1n5swt70iaq5y; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.submitted_question
    ADD CONSTRAINT fkj2w5yyp7hiaq1n5swt70iaq5y FOREIGN KEY (questionnaire_submission_id) REFERENCES public.questionnaire_submission(id);


--
-- Name: questionnaire fkjcas422mtqo9k5k1fiq78wfcg; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire
    ADD CONSTRAINT fkjcas422mtqo9k5k1fiq78wfcg FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: task fkk8qrwowg31kx7hp93sru1pdqa; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT fkk8qrwowg31kx7hp93sru1pdqa FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: group_inactive_members fkktn3tua0x5ctivxtbwpp93kav; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_inactive_members
    ADD CONSTRAINT fkktn3tua0x5ctivxtbwpp93kav FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: user_group fklvdk2nij4mr6wducowxgtkmlj; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT fklvdk2nij4mr6wducowxgtkmlj FOREIGN KEY (created_by_user_id) REFERENCES public.application_user(id);


--
-- Name: token_group_permissions fkmp49tpyq3sni1og9xjlyqka1c; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.token_group_permissions
    ADD CONSTRAINT fkmp49tpyq3sni1og9xjlyqka1c FOREIGN KEY (token_id) REFERENCES public.pre_registration_verification_token(id);


--
-- Name: questionnaire_submission fkmstq6mmglpmjhjrh2pho3arp0; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire_submission
    ADD CONSTRAINT fkmstq6mmglpmjhjrh2pho3arp0 FOREIGN KEY (questionnaire_id) REFERENCES public.questionnaire(id);


--
-- Name: user_group fkmuinr739hp78bxjeyduxul1ef; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.user_group
    ADD CONSTRAINT fkmuinr739hp78bxjeyduxul1ef FOREIGN KEY (updated_by_user_id) REFERENCES public.application_user(id);


--
-- Name: project_coordinators fkoafkq5lkbkaax4ximdi5bmqdn; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_coordinators
    ADD CONSTRAINT fkoafkq5lkbkaax4ximdi5bmqdn FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: project_join_request fkoisjtnwekg584f0g9rdxf0dvs; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_join_request
    ADD CONSTRAINT fkoisjtnwekg584f0g9rdxf0dvs FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: project_coordinators fkp01ermwy85cte7qi3uuipyjx; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_coordinators
    ADD CONSTRAINT fkp01ermwy85cte7qi3uuipyjx FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: group_join_request fkppq6numghahv7aukaonu02bax; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_join_request
    ADD CONSTRAINT fkppq6numghahv7aukaonu02bax FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: group_admins fkrhq1wcep1f2uaod6m0dcsqgf7; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.group_admins
    ADD CONSTRAINT fkrhq1wcep1f2uaod6m0dcsqgf7 FOREIGN KEY (group_id) REFERENCES public.user_group(id);


--
-- Name: project_join_request fkrw30jx81fej8mjgrtnpillqil; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_join_request
    ADD CONSTRAINT fkrw30jx81fej8mjgrtnpillqil FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: token_project_permissions fkryjswbnavjijbnstpj3nxy3w0; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.token_project_permissions
    ADD CONSTRAINT fkryjswbnavjijbnstpj3nxy3w0 FOREIGN KEY (token_id) REFERENCES public.pre_registration_verification_token(id);


--
-- Name: project fksc72ljjuswnxr2pfp8xqjwxyi; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT fksc72ljjuswnxr2pfp8xqjwxyi FOREIGN KEY (created_by_user_id) REFERENCES public.application_user(id);


--
-- Name: submitted_answer fksyfobrvr43sd3fjlu2wu6vor2; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.submitted_answer
    ADD CONSTRAINT fksyfobrvr43sd3fjlu2wu6vor2 FOREIGN KEY (submitted_question_id) REFERENCES public.submitted_question(id);


--
-- Name: project_editors fkt1h7kpbguea7o3ldceoyt4es2; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_editors
    ADD CONSTRAINT fkt1h7kpbguea7o3ldceoyt4es2 FOREIGN KEY (project_id) REFERENCES public.project(id);


--
-- Name: project_editors fkt5u90lhnip63oxhoh8oki6cqa; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.project_editors
    ADD CONSTRAINT fkt5u90lhnip63oxhoh8oki6cqa FOREIGN KEY (user_id) REFERENCES public.application_user(id);


--
-- Name: questionnaire fkt9jhtf1kucg6l9mcdm17jwi6; Type: FK CONSTRAINT; Schema: public; Owner: trainingportaluser
--

ALTER TABLE ONLY public.questionnaire
    ADD CONSTRAINT fkt9jhtf1kucg6l9mcdm17jwi6 FOREIGN KEY (created_by_user_id) REFERENCES public.application_user(id);


--
-- PostgreSQL database dump complete
--

