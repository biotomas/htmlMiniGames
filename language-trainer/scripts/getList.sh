cnt=1
all=`wc -l $1 | cut -d" " -f 1`
cat $1 | while read l 
do
    echo "doing $l, $cnt of $all"
    cnt=$(($cnt+1))
    ./getVerb.sh $l >> $1.csv
done