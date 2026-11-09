"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";

import { projectTypes } from "@/lib/contact-schema";
const budgets = [
  "Under $1,000",
  "$1,000–$5,000",
  "$5,000–$15,000",
  "$15,000+",
  "Not sure yet",
];
const timelines = [
  "As soon as possible",
  "Within 1–3 months",
  "Within 3–6 months",
  "Flexible",
];

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setState("sending");
    setMessage("");
    const data = new FormData(form);
    const payload: Record<string, FormDataEntryValue | boolean> =
      Object.fromEntries(data.entries());
    payload.privacy = data.get("privacy") === "on";
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "We couldn’t send your inquiry. Please try again.",
        );
      setState("success");
      setMessage(result.message);
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please email us directly.",
      );
    }
  }
  if (state === "success")
    return (
      <div className="form-status form-success" role="status">
        <span className="status-mark">✓</span>
        <div>
          <h2>Message received.</h2>
          <p>{message}</p>
          <button
            className="text-link"
            type="button"
            onClick={() => {
              setState("idle");
              setMessage("");
            }}
          >
            Send another inquiry <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label>
          Full name <span>*</span>
          <input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your name"
          />
        </label>
        <label>
          Business email <span>*</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@company.com"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Company or organization <small>Optional</small>
          <input
            name="company"
            autoComplete="organization"
            maxLength={120}
            placeholder="Company name"
          />
        </label>
        <label>
          Project type <span>*</span>
          <select name="projectType" required defaultValue="">
            <option value="" disabled>
              Select a capability
            </option>
            {projectTypes.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Budget range <small>Optional</small>
          <select name="budget" defaultValue="">
            <option value="">Choose a range</option>
            {budgets.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Ideal timeline <small>Optional</small>
          <select name="timeline" defaultValue="">
            <option value="">Choose a timeline</option>
            {timelines.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Tell us about the project <span>*</span>
        <textarea
          name="description"
          required
          minLength={20}
          maxLength={4000}
          rows={5}
          placeholder="What are you hoping to make possible? A little context helps us prepare."
        />
      </label>
      <label className="honeypot" aria-hidden="true">
        Leave this field empty
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="checkbox-label">
        <input type="checkbox" name="privacy" required />
        <span>
          I agree that ATLaS can use these details to respond to my inquiry. See
          the <a href="/privacy">privacy policy</a>. <b>*</b>
        </span>
      </label>
      {state === "error" && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}
      <div className="form-submit-row">
        <button
          className="button button-coral"
          type="submit"
          disabled={state === "sending"}
        >
          {state === "sending" ? (
            <>
              <LoaderCircle size={16} className="spin" /> Sending…
            </>
          ) : (
            <>
              Send inquiry <ArrowUpRight size={16} />
            </>
          )}
        </button>
        <span>We’ll get back to you as soon as we can.</span>
      </div>
    </form>
  );
}
