import React from "react";
import { motion, AnimatePresence } from "motion/react";

export default function CertificateShowcase() {
  const [userName, setUserName] = React.useState("Sarah Jenkins");
  const [specialization, setSpecialization] = React.useState(
    "Artificial Intelligence & Machine Learning"
  );
  const [credentialId, setCredentialId] =
    React.useState("CG-AI-902847-X");
  const [isCopied, setIsCopied] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);

  // Generate a random credential hash ID based on specialization
  React.useEffect(() => {
    const prefix = specialization.includes("Artificial")
      ? "CG-AI"
      : specialization.includes("MERN")
      ? "CG-MERN"
      : "CG-DATA";

    const randomNum = Math.floor(100000 + Math.random() * 900000);

    setCredentialId(`${prefix}-${randomNum}-X`);
  }, [specialization]);

  const triggerShare = () => {
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2500);
  };

  const verifyCredentialOnChain = () => {
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <section
      id="credentials"
      className="py-20 max-w-7xl mx-auto px-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* Left column configuration parameters */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-2">
              DIGITAL SECURE BADGES
            </div>

            <h2 className="font-sans font-extrabold text-3xl md:text-5xl text-brand-dark tracking-tight leading-tight">
              Verified Digital <br />
              <span className="text-brand-primary">
                Credentials.
              </span>
            </h2>

            <p className="font-sans text-sm md:text-base text-brand-dark/60 mt-3 leading-relaxed">
              Every course completion logs a tamper-proof digital
              certificate onto our public ledger, fully shareable
              directly onto your LinkedIn profile. Try editing the
              credentials live!
            </p>
          </div>

          {/* Form parameters */}
          <div className="bg-white p-6 rounded-2xl border border-brand-dark/5 shadow-md space-y-4">

            <div>
              <label className="block text-xs font-bold uppercase text-brand-dark/50 mb-1.5 font-sans">
                Student Full Name
              </label>

              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                maxLength={30}
                placeholder="Enter candidate name"
                className="w-full bg-brand-surface/70 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-dark/50 mb-1.5 font-sans">
                Specialization Track
              </label>

              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-brand-surface/70 border border-brand-dark/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-brand-primary cursor-pointer"
              >
                <option value="Artificial Intelligence & Machine Learning">
                  Artificial Intelligence & Machine Learning
                </option>

                <option value="MERN Full-Stack System Architecture">
                  MERN Full-Stack System Architecture
                </option>

                <option value="Data Science & Quantitative Pipelines">
                  Data Science & Quantitative Pipelines
                </option>
              </select>
            </div>

            <div className="pt-2 flex gap-3">

              <button
                onClick={verifyCredentialOnChain}
                className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer"
              >
                {isVerifying
                  ? "Querying Ledgers..."
                  : "Verify Registry"}
              </button>

              <button
                onClick={triggerShare}
                className="flex-1 bg-white border border-brand-dark/10 hover:bg-brand-surface text-brand-dark text-xs font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer"
              >
                Share Credential
              </button>

            </div>
          </div>
        </div>

        {/* Right column live interactive certificate renderer */}
        <div className="lg:col-span-7 flex justify-center w-full">
          <div className="relative w-full max-w-xl">

            {/* Certificate Frame */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-8 border-brand-surface relative overflow-hidden flex flex-col justify-between aspect-[1.414/1] w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">

              {/* Corner Ornaments */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-primary/25"></div>

              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-primary/25"></div>

              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-primary/25"></div>

              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-primary/25"></div>

              {/* Certificate Header */}
              <div className="flex justify-between items-start">

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-brand-primary text-xl font-bold">
                    rocket_launch
                  </span>

                  <span className="font-sans text-xs font-extrabold tracking-tighter text-brand-dark">
                    Careergize
                    <span className="text-brand-primary">.</span>
                  </span>
                </div>

                <span className="font-mono text-[9px] text-brand-dark/40 uppercase tracking-widest bg-brand-surface px-2.5 py-1 rounded">
                  SECURE LEDGER RECORD
                </span>

              </div>

              {/* Certificate Main Title */}
              <div className="text-center my-6 space-y-3.5">

                <h3 className="font-sans font-extrabold text-xs text-brand-primary tracking-widest uppercase">
                  Certificate of Accomplishment
                </h3>

                <p className="text-[10px] text-brand-dark/40 italic">
                  This verified document is proudly presented to
                </p>

                <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-brand-dark tracking-tight leading-none px-4 py-1.5 border-b border-brand-dark/10 max-w-sm mx-auto">
                  {userName || "Your Name"}
                </h2>

                <p className="text-[10px] text-brand-dark/50 max-w-md mx-auto leading-relaxed">
                  For successfully meeting all course criteria and
                  technical logic challenges of the career transformation
                  syllabus in{" "}
                  <span className="font-bold text-brand-dark">
                    {specialization}
                  </span>.
                </p>

              </div>

              {/* Certificate Footer */}
              <div className="flex justify-between items-end border-t border-brand-dark/5 pt-4">

                <div className="text-left space-y-1">

                  <div className="text-[9px] font-bold text-brand-dark/40 uppercase">
                    Credential ID
                  </div>

                  <div className="font-mono text-[10px] text-brand-dark font-semibold">
                    {credentialId}
                  </div>

                  <div className="flex items-center gap-1.5">

                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>

                    <span className="text-[9px] text-emerald-600 font-bold uppercase">
                      Registry Status: ACTIVE
                    </span>

                  </div>

                </div>

                {/* Simulated signature block */}
                <div className="text-right space-y-1">

                  <div className="font-sans italic text-sm text-brand-dark/80 tracking-tight font-semibold">
                    Dr. Anthony Vance
                  </div>

                  <div className="text-[9px] font-bold text-brand-dark/40 uppercase">
                    Dean of Systems Engineering
                  </div>

                </div>

              </div>

            </div>

            {/* Micro-feedback state */}
            <AnimatePresence>
              {isCopied && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.95
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95
                  }}
                  className="absolute inset-0 bg-brand-dark/90 rounded-3xl flex flex-col justify-center items-center text-white p-6 z-20 gap-3"
                >

                  <span className="material-symbols-outlined text-emerald-400 text-4xl font-bold">
                    check_circle
                  </span>

                  <h4 className="font-sans font-extrabold text-lg">
                    Shared Successfully!
                  </h4>

                  <p className="font-sans text-xs text-white/70 max-w-xs text-center leading-relaxed">
                    Credential link copied! You can now paste this URL
                    as a verified badge directly onto your LinkedIn
                    profile or portfolio page.
                  </p>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
}