Invoke-Expression -Command (Get-ECRLoginCommand -Region us-east-1).Command
docker build -t iwouldlike2rage/hobby-paints-color-matcher .
docker tag iwouldlike2rage/hobby-paints-color-matcher:latest 517732130218.dkr.ecr.us-east-1.amazonaws.com/iwouldlike2rage/hobby-paints-color-matcher:latest
docker push 517732130218.dkr.ecr.us-east-1.amazonaws.com/iwouldlike2rage/hobby-paints-color-matcher:latest
