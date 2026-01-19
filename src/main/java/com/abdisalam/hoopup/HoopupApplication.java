package com.abdisalam.hoopup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;

@SpringBootApplication
public class HoopupApplication {

    public static void main(String[] args) {
        SpringApplication.run(HoopupApplication.class, args);

        int[] arr = {-5, -2, -8, -1};
        System.out.println("Second Largest: " + secondLargest(arr));

        ArrayList<Integer> numbers = new ArrayList<>();

        numbers.add(10);
        numbers.add(20);
        numbers.add(30);
        numbers.add(40);
        numbers.add(50);


        numbers.remove(2);

        numbers.add(1, 25);

        System.out.println(numbers);

        int size = numbers.size();
        System.out.println("Size of the list: " + size);

        int value = numbers.get(2);
        System.out.println("Value at index 1: " + value);

        System.out.println(numbers);

        for(int i = 0; i < numbers.size(); i++){
            System.out.println(numbers.get(i));
        }
    }


    public static int secondLargest(int[] arr){
        int largest = arr[0];
        int secondLargest = arr[0];

        for(int i = 1; i < arr.length; i++){
            if(arr[i] > largest){
                secondLargest = largest;
                largest = arr[i];
            }else if(arr[i] > secondLargest){
                secondLargest = arr[i];
            }
        }
        return secondLargest;
    }
}
