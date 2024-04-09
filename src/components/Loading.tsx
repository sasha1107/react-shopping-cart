import Spinner from "@/assets/spinner.svg?react";
const Loading = () => {
  return (
    <div className="w-dvw h-dvh flex justify-center items-center fixed top-0 left-0 z-50 bg-white-dimmed">
      <div
        role="status"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-primary-400"
      >
        <Spinner />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
