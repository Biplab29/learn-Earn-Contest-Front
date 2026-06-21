import Container from "@/components/ui/Container";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="theme-page-shell min-h-screen py-10 sm:py-14">
      <Container>

        {/* HERO */}
        <div className="relative mb-14 sm:mb-20 rounded-3xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#82C600] via-[#a3e635] to-[#6ea800]" />
          <div className="absolute top-[-80px] right-[-80px] w-[260px] h-[260px] bg-white/20 blur-3xl rounded-full" />
          <div className="absolute bottom-[-60px] left-[-60px] w-[200px] h-[200px] bg-white/10 blur-3xl rounded-full" />

          <div className="relative z-10 p-6 sm:p-10 lg:p-14 text-white max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Let's Talk 👋
            </h1>
            <p className="mt-4 text-sm sm:text-base opacity-90">
              Have a question or need help? We're always here.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* FORM */}
          <div className="theme-surface rounded-3xl p-6 sm:p-8">
            <h2 className="theme-text text-lg sm:text-xl font-semibold mb-6">
              Send a Message
            </h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="theme-input w-full p-3 rounded-xl outline-none"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="theme-input w-full p-3 rounded-xl outline-none"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="theme-input w-full p-3 rounded-xl outline-none resize-none"
              />

              <button
                type="submit"
                className="theme-brand-button w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
              >
                Send Message <FaPaperPlane />
              </button>
            </form>
          </div>

          {/* INFO CARDS */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {[
              {
                icon: <FaEnvelope />,
                title: "Email",
                value: "support@contestplatform.com",
              },
              {
                icon: <FaPhone />,
                title: "Phone",
                value: "+91 98765 43210",
              },
              {
                icon: <FaMapMarkerAlt />,
                title: "Location",
                value: "Kolkata, India",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="theme-surface theme-card-hover flex items-center gap-4 p-5 sm:p-6 rounded-2xl transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#82C600]/10 text-[#82C600] text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="theme-text font-semibold">
                    {item.title}
                  </h3>
                  <p className="theme-text-muted text-sm mt-0.5">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 sm:mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#82C600] to-[#a3e635] rounded-3xl blur-2xl opacity-30" />
          <div className="relative bg-gradient-to-r from-[#82C600] to-[#a3e635] p-8 sm:p-10 rounded-3xl text-center text-white shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold">
              Need Instant Support?
            </h2>
            <p className="mt-2 text-sm opacity-90">
              Our team is available 24/7 🚀
            </p>
            <button className="mt-6 px-6 py-3 bg-[#fbd300] text-black rounded-xl font-semibold hover:scale-105 transition">
              Contact Support →
            </button>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default ContactPage;