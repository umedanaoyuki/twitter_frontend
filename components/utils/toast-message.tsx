type ToastMessageProps = {
  message: string;
};

function ToastMessage({ message }: ToastMessageProps) {
  const normalized = message.replace(/\\n/g, "\n");

  return <span className="whitespace-pre-line">{normalized}</span>;
}

export { ToastMessage };
