const formatDueDate = (timestamp?: number) => {
  if (!timestamp) return 'No due date';

  const due = new Date(timestamp);
  return due.toLocaleDateString();
};
export default formatDueDate;
