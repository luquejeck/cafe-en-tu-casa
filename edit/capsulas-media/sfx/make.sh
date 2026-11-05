#!/bin/sh
# Sonidos sintetizados para el reel (sin derechos de terceros). Correr desde la raíz del proyecto.
D=edit/capsulas-media/sfx
# golpe grave para el cuadro 0
ffmpeg -v error -y -f lavfi -i "aevalsrc='0.9*sin(2*PI*(70-30*t)*t)*exp(-9*t)':s=48000:d=0.45" $D/grave.wav
# whoosh del tiro: ruido filtrado con barrido
ffmpeg -v error -y -f lavfi -i "anoisesrc=d=0.7:c=pink:r=48000:a=0.9" -af "bandpass=f=1400:w=1.2,afade=t=in:d=0.35:curve=exp,afade=t=out:st=0.35:d=0.35,volume=2" $D/whoosh.wav
# clic suave para la pregunta
ffmpeg -v error -y -f lavfi -i "aevalsrc='0.8*sin(2*PI*2200*t)*exp(-90*t)':s=48000:d=0.08" $D/tick.wav
# base: pad en La menor con trémolo lento, 9,5 s
ffmpeg -v error -y -f lavfi -i "aevalsrc='(0.25*sin(2*PI*220*t)+0.2*sin(2*PI*261.63*t)+0.18*sin(2*PI*329.63*t)+0.12*sin(2*PI*110*t))*(0.8+0.2*sin(2*PI*0.5*t))':s=48000:d=9.5" -af "lowpass=f=1800,afade=t=in:d=0.05,afade=t=out:st=12.866999999999999:d=0.9,aecho=0.8:0.6:120:0.3" $D/pad.wav
