from flask import Flask, render_template, request, jsonify
from datetime import datetime, timedelta
import json
import os
from pathlib import Path

app = Flask(__name__)

# Database file path
DATA_FILE = 'entries.json'

def load_entries():
    """Load entries from JSON file"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_entries(entries):
    """Save entries to JSON file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(entries, f, indent=2)

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/api/entry', methods=['POST'])
def add_entry():
    """Add a new entry (entry or exit)"""
    try:
        data = request.json
        entry_type = data.get('type')  # 'entry' or 'exit'
        
        if entry_type not in ['entry', 'exit']:
            return jsonify({'success': False, 'message': 'தவறான பதிவு வகை'}), 400
        
        entries = load_entries()
        person_name = data.get('person_name', 'Unknown')
        place_from = data.get('place_from', '')
        place_to = data.get('place_to', '')

        new_entry = {
            'id': len(entries) + 1,
            'type': entry_type,
            'person_name': person_name,
            'place_from': place_from,
            'place_to': place_to,
            'timestamp': datetime.now().isoformat(),
            'time_display': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        entries.append(new_entry)
        save_entries(entries)

        # Tamil success messages
        if entry_type == 'entry':
            msg = 'நுழைவு வெற்றிகரமாக பதிவு செய்யப்பட்டது'
        else:
            msg = 'வெளியேறு வெற்றிகரமாக பதிவு செய்யப்பட்டது'

        return jsonify({
            'success': True,
            'message': msg,
            'entry': new_entry
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/entries', methods=['GET'])
def get_entries():
    """Get all entries"""
    try:
        entries = load_entries()
        return jsonify({'success': True, 'entries': entries})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/entries/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    """Delete an entry"""
    try:
        entries = load_entries()
        entries = [e for e in entries if e['id'] != entry_id]
        save_entries(entries)
        return jsonify({'success': True, 'message': 'பதிவு நீக்கப்பட்டது'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics"""
    try:
        entries = load_entries()
        
        total_entries = len([e for e in entries if e['type'] == 'entry'])
        total_exits = len([e for e in entries if e['type'] == 'exit'])
        
        # Calculate total time in (if entries and exits are paired)
        total_duration = timedelta()
        current_entry_time = None
        
        for entry in entries:
            if entry['type'] == 'entry':
                current_entry_time = datetime.fromisoformat(entry['timestamp'])
            elif entry['type'] == 'exit' and current_entry_time:
                exit_time = datetime.fromisoformat(entry['timestamp'])
                total_duration += exit_time - current_entry_time
                current_entry_time = None
        
        hours = total_duration.total_seconds() / 3600
        
        return jsonify({
            'success': True,
            'stats': {
                'total_entries': total_entries,
                'total_exits': total_exits,
                'total_hours': round(hours, 2)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/clear', methods=['POST'])
def clear_all():
    """Clear all entries"""
    try:
        save_entries([])
        return jsonify({'success': True, 'message': 'அனைத்து பதிவுகளும் அழிக்கப்பட்டன'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
