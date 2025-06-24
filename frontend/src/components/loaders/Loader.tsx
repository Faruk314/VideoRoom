import { Spinner } from "./Spinner";

export default function Loader() {
  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center">
      <Spinner />
    </div>
  );
}
