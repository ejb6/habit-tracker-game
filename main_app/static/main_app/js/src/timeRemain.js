// This is used to calculate the remaining time before a deadline:
function timeRemain(deadlineStr) {
  const dateNow = new Date();
  const dateDeadline = new Date(deadlineStr);
  // Time difference in days:
  let diff = Math.round((dateDeadline - dateNow) / (1000 * 60 * 60 * 24));

  // Return value:
  let remain = '';

  // Way past deadline:
  if (diff < -1) {
    remain = `${-diff} days overdue`;
    // Deadline is not yet near:
  } else if (diff > 1) {
    remain = `${diff} days left`;
  } else {
    // Less than 24 hours left:
    // Time difference in hours:
    diff = Math.round((dateDeadline - dateNow) / (1000 * 60 * 60));
    if (diff === 0) {
      remain = 'Less than 30 mins left';
    } else if (diff === 1) {
      remain = '1 hour left';
    } else if (diff > 1) {
      remain = `${diff} hours left`;
    } else {
      // Less than 1 day overdue:
      remain = 'Overdue';
    }
  }
  return remain;
}

export default timeRemain;
