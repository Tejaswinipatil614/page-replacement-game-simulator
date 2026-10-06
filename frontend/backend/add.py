from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.json
    pages = data['pages']
    frames = data['frames']
    algo = data['algo']
    guess = data['guess']

    frame = []
    faults = 0
    steps = []

    for i, page in enumerate(pages):
        if page not in frame:
            faults += 1
            replaced = None

            if len(frame) < frames:
                frame.append(page)
            else:
                if algo == "FIFO":
                    replaced = frame.pop(0)
                else:
                    last_used = {p: max(j for j in range(i) if pages[j] == p) for p in frame}
                    replaced = min(last_used, key=last_used.get)
                    frame.remove(replaced)

                frame.append(page)

            steps.append({
                "step": i+1,
                "page": page,
                "frames": frame.copy(),
                "replaced": replaced,
                "correct": replaced == guess
            })

    return jsonify({"faults": faults, "steps": steps})

if __name__ == "__main__":
    app.run(debug=True)