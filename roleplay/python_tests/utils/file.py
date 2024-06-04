import os
import shutil

def move_file(path_from, path_to, filename):
    os.rename(path_from+filename, path_to+filename)
    os.replace(path_from+filename, path_to+filename)
    shutil.move(path_from+filename, path_to+filename)
    print("fichiers déplacés.")