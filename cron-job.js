const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const TODOS_FILE = path.join(__dirname, 'todos.json');

// Function to perform the cron job
function performCronJob() {
  console.log('Cron job started'); // Logging for troubleshooting

  // Read the current data from todos.json
  fs.readFile(TODOS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading todos.json:', err);
      return;
    }

    try {
      let todos = JSON.parse(data);

      // Filter out completed to-do items
      const newTodos = todos.filter((todo) => !todo.completed);

      // Write the filtered data back to todos.json
      fs.writeFile(TODOS_FILE, JSON.stringify(newTodos, null, 2), (err) => {
        if (err) {
          console.error('Error writing todos.json:', err);
        } else {
          console.log('Cron job executed - Removed completed to-do items.');
        }
      });
    } catch (parseError) {
      console.error('Error parsing todos.json:', parseError);
    }
  });
  console.log('Cron job finished'); // Logging for troubleshooting
}

// Schedule the cron job to run at midnight (00:00) daily
cron.schedule('0 0 * * *', () => {
  performCronJob();
});

