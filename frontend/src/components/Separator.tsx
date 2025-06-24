export default function Separator() {
  return (
    <div className="flex items-center w-full space-x-4 text-gray-500">
      <hr className="flex-grow border-t border-gray-300" />
      <span className="text-sm font-medium">OR</span>
      <hr className="flex-grow border-t border-gray-300" />
    </div>
  );
}
