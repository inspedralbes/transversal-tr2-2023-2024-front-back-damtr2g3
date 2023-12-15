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
    y_values = df['correcta']
    x_values = df['erronea']
    plt.scatter(x_values, y_values)
    plt.title('Agrupacio preguntes en relacio al seus acerts/errors')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Acerts')  
    ax.set_ylabel('Errors')
    plt.savefig('./grafics/graficsPreguntes/_dispersio.jpeg')