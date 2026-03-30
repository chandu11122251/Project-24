import AboutUs from "@/components/sections/AboutUs";
import Challenges from "@/components/sections/Challenges";
import Footer from "@/components/sections/Footer";
import Hackathons from "@/components/sections/Hackathons";
import Hero from "@/components/sections/Hero";
import PuzzleGames from "@/components/sections/PuzzleGames";
import StudyGroups from "@/components/sections/StudyGroups";
import Webinar from "@/components/sections/Webinar";

export default function Home() {
  return (
    <div className="bg-gray-950 text-white">
      <Hero />
      <PuzzleGames />
      <Challenges />
      <Hackathons />
      <Webinar />
      <StudyGroups />
      <AboutUs />
      <Footer />
    </div>
  );
}
