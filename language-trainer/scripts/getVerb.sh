#!/bin/bash

rm -f verb.html
wget -q https://cooljugator.com/hu/$1 -O verb.html
if (($? != 0))
then
echo "$1 not found"
exit
fi
l=`./tidy verb.html 2>/dev/null | grep -Po '<div class="meta-form">\K.*?(?=</div>)' | tr "\n" ","`

#echo "l=" $l
cols=`echo $l | tr "," "\n" | wc -l | cut -d" " -f1`
#echo "cols=" $cols
if [[ $cols < 50 ]]
then
echo `echo $l | cut -d, -f1-6`,,,,,,,`echo $l | cut -d, -f7-12`,,,,,,,`echo $l | cut -d, -f25-30`
else
echo $l | cut -d, -f1-24,49-60
fi
rm -f verb.html
