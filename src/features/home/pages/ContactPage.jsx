import Container from "@/components/ui/Container";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";

const ContactPage = () => {
  return (
    <div className="
      min-h-screen 
      bg-gradient-to-br from-[#f8fafc] via-white to-[#ecfdf5] 
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
      py-10 sm:py-14
    ">

      <Container>

        {/* HERO */}
        <div className="relative mb-14 sm:mb-20 rounded-3xl overflow-hidden shadow-xl">

          <div className="absolute inset-0 bg-gradient-to-r from-[#82C600] via-[#a3e635] to-[#6ea800]" />

          <div className="absolute top-[-80px] right-[-80px] w-[260px] h-[260px] bg-white/20 blur-3xl rounded-full" />
          <div className="absolute bottom-[-60px] left-[-60px] w-[200px] h-[200px] bg-white/10 blur-3xl rounded-full" />

          <div className="relative z-10 p-6 sm:p-10 lg:p-14 text-white max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Let’s Talk 👋
            </h1>

            <p className="mt-4 text-sm sm:text-base opacity-90">
              Have a question or need help? We’re always here.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* FORM */}
          <div className="
            relative 
            bg-white/60 dark:bg-gray-900/60 
            backdrop-blur-2xl 
            border border-white/30 dark:border-gray-800 
            rounded-3xl p-6 sm:p-8 
            shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          ">

            <h2 className="text-lg sm:text-xl font-semibold 
            text-gray-800 dark:text-gray-100 mb-6">
              Send a Message
            </h2>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-xl border 
                bg-white/70 dark:bg-gray-800/70 
                text-gray-800 dark:text-white
                border-gray-200 dark:border-gray-700
                outline-none focus:ring-2 focus:ring-[#82C600]"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-xl border 
                bg-white/70 dark:bg-gray-800/70 
                text-gray-800 dark:text-white
                border-gray-200 dark:border-gray-700
                outline-none focus:ring-2 focus:ring-[#82C600]"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full p-3 rounded-xl border 
                bg-white/70 dark:bg-gray-800/70 
                text-gray-800 dark:text-white
                border-gray-200 dark:border-gray-700
                outline-none focus:ring-2 focus:ring-[#82C600]"
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 
                bg-gradient-to-r from-[#82C600] to-[#a3e635] 
                text-white py-3 rounded-xl font-semibold 
                shadow-md hover:shadow-xl hover:scale-[1.02] transition"
              >
                Send Message <FaPaperPlane />
              </button>

            </form>
          </div>

          {/* INFO */}
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
                className="
                flex items-center gap-4 
                bg-white/60 dark:bg-gray-900/60 
                backdrop-blur-xl 
                border border-white/30 dark:border-gray-800 
                p-5 sm:p-6 rounded-2xl 
                shadow-md hover:shadow-xl hover:-translate-y-1 transition
              "
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl 
                bg-[#82C600]/10 text-[#82C600] text-xl">
                  {item.icon}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 sm:mt-20 relative">

          <div className="absolute inset-0 bg-gradient-to-r from-[#82C600] to-[#a3e635] rounded-3xl blur-2xl opacity-30"></div>

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