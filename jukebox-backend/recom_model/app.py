from flask import Flask, request, render_template
from recom_by_songs import MusicRecommender
from recom_by_playlist import PlaylistRecommender  # Different logic, same dataset

app = Flask(__name__)

# Initialize recommenders with SAME dataset
song_recommender = MusicRecommender('jukebox-backend/recom_model/filtered_data.csv')
playlist_recommender = PlaylistRecommender('jukebox-backend/recom_model/filtered_data.csv')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        model_type = request.form.get('model_type')
        songs = [request.form.get(f'song{i}') for i in range(1, 4)]
        songs = [s for s in songs if s]

        # Validate and call appropriate recommender
        if model_type == 'song':
            recommendations, error = song_recommender.recommend(songs)
        elif model_type == 'playlist':
            recommendations, error = playlist_recommender.recommend(songs)
        else:
            recommendations, error = None, "Invalid model type selected."

        # Render page with recommendations or error
        return render_template('index.html', recommendations=recommendations, error=error)

    # For GET request
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
