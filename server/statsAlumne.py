import pymongo
import matplotlib.pyplot as plt

# Conexión a MongoDB
client = pymongo.MongoClient("mongodb+srv://a22celgariba:5xaChqdY3ei4ukcp@cluster0.2skn7nc.mongodb.net/?retryWrites=true&w=majority")
db = client["G3-Proj2"]
collection = db["StatsAlumnes"]

# Extracción de datos
data = collection.find()

# Preparación de los datos para el gráfico
questions = []
answer_times = []
for item in data:
    if 'question' in item and 'answerTime' in item:
        questions.append(str(item['questionId']))
        answer_times.append(float(item['answerTime']))

# Generación del gráfico de barras
plt.bar(questions, answer_times)
plt.xlabel('Pregunta')
plt.ylabel('Tiempo de respuesta')
plt.title('Tiempo de respuesta por pregunta')
plt.xticks(rotation=90)  # Rotar las etiquetas del eje x 45 grados para mejor visualización
plt.savefig('./statsAlumne.png')  
