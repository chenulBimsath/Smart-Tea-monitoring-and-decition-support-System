from flask import Flask, jsonify
import yield_prediction_ml # This imports your existing script
import os

app = Flask(__name__)

@app.route('/run-pipeline', methods=['POST'])
def run_pipeline():
    try:
        # Run the functions from your script
        raw_df  = yield_prediction_ml.fetch_training_data()
        div_map = yield_prediction_ml.fetch_divisions()
        live    = yield_prediction_ml.fetch_live_weather()
        df      = yield_prediction_ml.build_training_df(raw_df, div_map)
        model, mae, r2 = yield_prediction_ml.train_model(df)
        preds = yield_prediction_ml.generate_predictions(df, model, div_map, live)
        yield_prediction_ml.save_predictions(preds)
        
        return jsonify({
            "status": "success", 
            "message": "Pipeline ran and Supabase DB updated!"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Listen on all network interfaces inside the Docker container
    app.run(host='0.0.0.0', port=5000)