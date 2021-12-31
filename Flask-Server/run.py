from app import create_app
app = create_app()
import sys
if __name__ == "__main__":
    app.run(port=5000)