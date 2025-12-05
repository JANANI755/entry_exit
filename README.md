# Entry/Exit Tracker

A web-based application to track entry and exit times for work, building access, or any time-tracking purposes.

## Features

- 🔓 **Easy Entry/Exit Logging** - One-click buttons to record entry and exit times
- 📊 **Statistics Dashboard** - View total entries, exits, and total hours tracked
- 📋 **Entry History** - See all recorded entries with timestamps
- 🗑️ **Delete Entries** - Remove individual entries or clear all data
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 💾 **Local Storage** - Data is saved to a JSON file locally

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Setup

1. **Clone/Open the project:**
   ```powershell
   cd "c:\Users\janan\OneDrive\Desktop\jig\python website"
   ```

2. **Create a virtual environment (optional but recommended):**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

## Running the Application

1. **Start the Flask server:**
   ```powershell
   python app.py
   ```

2. **Open your browser and navigate to:**
   ```
   http://localhost:5000
   ```

3. **Use the application:**
   - Click "Entry" to record when you enter
   - Click "Exit" to record when you leave
   - View your entries and statistics in real-time
   - Delete individual entries with the "Delete" button
   - Clear all entries with the "Clear All" button

## Project Structure

```
.
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── entries.json          # Data file (created after first entry)
├── templates/
│   └── index.html        # HTML template
└── static/
    ├── style.css         # Styling
    └── script.js         # Frontend JavaScript
```

## API Endpoints

- `POST /api/entry` - Record a new entry or exit
- `GET /api/entries` - Get all entries
- `GET /api/stats` - Get statistics
- `DELETE /api/entries/<id>` - Delete a specific entry
- `POST /api/clear` - Clear all entries

## Data Storage

All entries are stored in `entries.json` in JSON format:

```json
[
  {
    "id": 1,
    "type": "entry",
    "timestamp": "2025-12-04T10:30:45.123456",
    "time_display": "2025-12-04 10:30:45"
  },
  {
    "id": 2,
    "type": "exit",
    "timestamp": "2025-12-04T17:45:30.654321",
    "time_display": "2025-12-04 17:45:30"
  }
]
```

## Customization

You can customize the application by:

1. **Changing the port** - Edit `app.py` and change the port number in `app.run(debug=True, port=5000)`
2. **Styling** - Modify `static/style.css` to change colors and appearance
3. **Data file location** - Change `DATA_FILE` in `app.py` to store data elsewhere
4. **Adding features** - Extend the API in `app.py` and frontend in `static/script.js`

## Tips

- Data is automatically calculated based on entry/exit pairs for total hours
- The application runs in debug mode by default (auto-reloads on code changes)
- All times are recorded in the local timezone
- The application stores data persistently in `entries.json`

## Troubleshooting

**Port already in use:**
```powershell
# Change the port in app.py or kill the process using port 5000
```

**Module not found error:**
```powershell
# Make sure you've installed all requirements
pip install -r requirements.txt
```

**Cannot connect to localhost:**
- Verify Flask is running (should see "Running on http://localhost:5000")
- Check that no firewall is blocking port 5000
- Try using `127.0.0.1` instead of `localhost`

## License

MIT License - Free to use and modify
