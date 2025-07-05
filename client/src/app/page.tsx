import Image from "next/image";

export default function Home() {
  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-semibold">
        Welcome to the Train Seat Booking System
      </h2>
      <p className="mt-4 text-muted-foreground">
        Login or Signup to reserve your train seats smartly.
      </p>
    </div>
  );
}
