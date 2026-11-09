import type { Metadata } from "next";
import { ClipboardList, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Eyebrow, PageHero } from "@/components/ui";
export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell ATLaS about your next digital project. We work with businesses in Bangladesh and around the world.",
};
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="CONTACT / 01"
        title={
          <>
            Good things start
            <br />
            <span className="muted">with a conversation.</span>
          </>
        }
        text="Tell us a little about the challenge or idea. We’ll read it carefully and follow up with a clear next step."
      />
      <section className="section contact-section">
        <div className="container contact-layout">
          <aside className="contact-aside">
            <Eyebrow>LET’S CONNECT</Eyebrow>
            <h2>
              Real people.
              <br />
              <span className="muted">Thoughtful replies.</span>
            </h2>
            <p>
              Share what you’re working on, what’s not working, or what you’d
              like to explore.
            </p>
            <div className="contact-detail">
              <ClipboardList size={17} />
              <div>
                <span>PROJECT INQUIRIES</span>
                <a href="#project-inquiry">Use the inquiry form</a>
              </div>
            </div>
            <div className="contact-detail">
              <MapPin size={17} />
              <div>
                <span>BASED IN</span>
                <p>Bangladesh · Working worldwide</p>
              </div>
            </div>
            <p className="contact-note">
              The form sends your inquiry when email delivery is configured.
              Your information is used to respond to your request.
            </p>
          </aside>
          <div className="contact-form-wrap" id="project-inquiry">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
