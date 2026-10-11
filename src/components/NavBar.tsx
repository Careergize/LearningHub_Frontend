import React from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const goToLogin = () => { setIsOpen(false); navigate("/login"); };
  const links = [ ["Explore", "#courses"], ["Career paths", "#bento"], ["AI Mentor", "#mentor"], ["Credentials", "#credentials"] ];

  return <nav className="site-nav">
    <a href="/" className="site-brand" aria-label="Careergize home"><img src="/src/assets/logo.jpeg" alt="Careergize" /></a>
    <div className="site-nav-links">
      {links.map(([label, href]) => <a href={href} key={label}>{label}{label === "Explore" && <ChevronDown size={14} />}</a>)}
    </div>
    <div className="site-nav-actions"><button className="nav-login" onClick={goToLogin}>Log in</button><button className="nav-join" onClick={() => navigate("/signup")}>Join for free <ArrowRight size={16} /></button></div>
    <button className="nav-menu-toggle" aria-label={isOpen ? "Close menu" : "Open menu"} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
    {isOpen && <div className="nav-mobile-menu">{links.map(([label, href]) => <a onClick={() => setIsOpen(false)} href={href} key={label}>{label}</a>)}<button onClick={goToLogin}>Log in</button><button className="nav-join" onClick={() => navigate("/signup")}>Join for free <ArrowRight size={16} /></button></div>}
  </nav>;
}
