from flask import Flask, request, render_template
from recom_by_songs import MusicRecommender

app = Flask(__name__)

# Initialize recommender
recommender = MusicRecommender('jukebox-backend/recom_model/filtered_data.csv')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        songs = [request.form.get(f'song{i}') for i in range(1, 4)]
        songs = [s for s in songs if s]

        recommendations, error = recommender.recommend(songs)
        if error:
            return render_template('index.html', error=error)
        return render_template('index.html', recommendations=recommendations)

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
