import Filters from "@/components/_Games/Luckypots/Filters";
import LuckypotListLoading from "@/components/_Games/Luckypots/List/loading";
import Container from "@/components/Container";

export default function LoadingPage() {
  return (
    <Container>
      {/* Filters  */}
      <Filters />
      {/* List  */}
      <div className="grid mt-3 w-full grid-cols-1 gap-2 md:grid-cols-3">
        <LuckypotListLoading />
      </div>
    </Container>
  );
}
