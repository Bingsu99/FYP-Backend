container_name=fyp-backend-app

echo "container name - $container_name"
if [ "$(docker ps -qa -f name=$container_name)" ]; then
            echo ":: Found container - container_name"
            if [ "$(docker ps -q -f name=$container_name)" ]; then
                echo ":: Stopping running container - $container_name"
                docker stop $container_name;
            fi
            echo ":: Removing stopped container - $container_name"
            docker rm $container_name;
fi

docker load --input fyp-backend-app.tar

docker run -d \
--name fyp-backend-app \
-p 3000:3000 \
fyp-backend-app:V1.0.0