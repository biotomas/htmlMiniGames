echo "words=["
cat $1 | while read l
do
    eng=`echo $l | cut -d, -f1`
    hu=`echo $l | cut -d, -f2`
    if [[ ! -z $eng && ! -z $hu ]]
    then
	echo '{"german":"'$eng'","hungarian":"'$hu'"},'
    fi
done
echo "]"