echo "verbs=["
cat $1 | while read l
do
    IFS=',' read -r -a arr <<< "$l"

    echo -n '{"deutsch":"'${arr[1]}'"'
    cnt=2
    for pref in a t pa pt fa ft
    do
	#echo $pref
	for pers in 1 2 3 4 5 6
	do
	    #echo $pref $pers
	    echo -n ', "'$pref$pers'":"'${arr[$cnt]}'"'
	    cnt=$(( $cnt + 1 ))
	done
    done
    echo '},'
done
echo "]"