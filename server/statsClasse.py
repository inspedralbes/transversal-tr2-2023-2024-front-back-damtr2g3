import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import rcParams
import sys
import json
#from sklearn.linear_model import LinearRegression
from datetime import date
info = sys.argv[1]
info2=json.loads(info)

def acertErrorXtema (info2): 
    df = pd.DataFrame(info2['stats'])
    x_values = df['tema'].unique()
    y_values = df['acerts'/'errors']
    plt.bar(x_values, y_values)
    plt.title('Acerts/Errors per tema')
    ax = plt.subplot()                   
    ax.set_xticks(x_values)             
    ax.set_xticklabels(x_values)       
    ax.set_xlabel('Tema')  
    ax.set_ylabel('%Acerts')
    plt.savefig('./graficsAlumnes/'+info2.idClasse+'/acertsErrors.jpeg')
    plt.show()
    #plt.close('all')