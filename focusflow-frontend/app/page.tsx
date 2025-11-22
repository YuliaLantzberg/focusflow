import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main>
        <div>
          <h1>Welcome to FocusFlow</h1>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </div>
      </main>
    </div>
  );
}
