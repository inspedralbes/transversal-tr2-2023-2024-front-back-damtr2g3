import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import rcParams
import sys
import json
#from sklearn.linear_model import LinearRegression
from datetime import date
info = sys.argv[1]
info2=json.loads(info)


def puntuacio (info2): 
    df = pd.DataFrame(info2)
    y_values = df['temps']
    x_values = df['pregunta']
    plt.bar(x_values, y_values)
    plt.title('Temps que es tarda en cada pregunta')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Pregunta')  
    ax.set_ylabel('Temps')
    plt.savefig('./grafics/graficsAlumnes/'+info2.idAlum+'temps_pregunta.jpeg')

def acertErrorXtema (info2): 
    df = pd.DataFrame(info2)
    x_values = df['pregunta'].unique()
    y_values = df['correcta']-['incorrecta']
    plt.bar(x_values, y_values)
    plt.title('Acerts/Errors per pregunta')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Pregunta')  
    ax.set_ylabel('Respostes correctes')
    plt.savefig('./grafics/graficsAlumnes/'+info2.idAlum+'respostes_pregunta.jpeg')

puntuacio()
acertErrorXtema()