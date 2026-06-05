import Footer from "./components/Footer";
import GithubCorner from "./components/GithubCorner";
import Header from "./components/Header";
import Home from "./components/Home";

function App() {
  return (
    <main className="blob-bg min-w-[100vw] min-h-screen flex flex-col relative"
      style={{ background: "linear-gradient(170deg, #FFF5E4 0%, #FEDEA9 40%, #FFE8C4 100%)" }}>
      <GithubCorner />
      <Header />
      <Home />
      <Footer />

      {/* Decorative floating shapes */}
      <div className="fixed top-[20%] left-[5%] w-8 h-8 rounded-full border-[3px] border-[#2B2B2B] opacity-10 animate-float pointer-events-none z-0"
        style={{ background: "var(--yellow)" }} />
      <div className="fixed top-[60%] right-[8%] w-6 h-6 border-[3px] border-[#2B2B2B] opacity-10 animate-wiggle pointer-events-none z-0"
        style={{ background: "var(--coral)", borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }} />
      <div className="fixed bottom-[30%] left-[10%] w-5 h-5 border-[3px] border-[#2B2B2B] opacity-[0.07] pointer-events-none z-0"
        style={{ background: "var(--teal)", transform: "rotate(45deg)" }} />
    </main>
  );
}

export default App;
