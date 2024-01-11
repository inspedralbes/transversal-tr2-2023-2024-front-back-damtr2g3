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
    y_values = df['answerTime']
    x_values = df['question']
    plt.plot(x_values, y_values)
    plt.title('Puntuacio al llarg del temps')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('')  
    ax.set_ylabel('')
    plt.savefig('./grafics/graficsAlumnes/'+info2.idAlum+'_puntuacio.jpeg')

def acertErrorXtema (info2): 
    df = pd.DataFrame(info2['stats'])
    x_values = df['question'].unique()
    y_values = df['resultat'].value_counts().tolist()
    plt.bar(x_values, y_values)
    plt.title('Acerts/Errors per tema')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Tema')  
    ax.set_ylabel('%Acerts')
    plt.savefig('./grafics/graficsAlumnes/'+info2.idAlum+'_acertsErrors.jpeg')

