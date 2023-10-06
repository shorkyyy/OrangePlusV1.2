import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, UIManager, LayoutAnimation, Platform } from 'react-native';
import { FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Change 'FontAwesome5' to the desired icon set
import DeleteConfirmationModal from './DeleteConfirmationModal';
import BudgetInputModal from './BudgetInputModal';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as Haptics from 'expo-haptics';
import { FlashList } from "@shopify/flash-list";

const dummyExpensesData = [
];
SplashScreen.preventAutoHideAsync();
setTimeout(() => {
  SplashScreen.hideAsync();
}, 1500);


const MainScreen = ({ route, navigation }) => {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());
  const [expensesData, setExpensesData] = useState([...dummyExpensesData]);
  const totalAmountByMonth = calculateTotalAmountByMonth(currentMonth);
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false); // State variable to control the visibility of the budget input modal
  const [budgetThreshold, setBudgetThreshold] = useState(4000000);
  
  const customAnimationConfig = {
    duration: 200, 
    create: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  };

  const fabAnimation = new Animated.Value(0);

  const [expenseToDelete, setExpenseToDelete] = useState(null); // Add state variable to track the expense to delete
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State variable to control the visibility of the delete confirmation modal
  const { expenseId } = route.params || {};

  const [notificationShown, setNotificationShown] = useState(false);

  const [filteredExpenses, setFilteredExpenses] = useState([]);
  
  const [expandedDates, setExpandedDates] = useState([]);
  const [sortedExpenses, setSortedExpenses] = useState([...dummyExpensesData]); // State variable to hold sorted expenses
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollThreshold = 20; // Adjust the threshold value as needed
  const opacityAnimation = useRef(new Animated.Value(1)).current; // 1 is the initial opacity


  const iconMap = {
    'Mua Sắm': 'shopping-bag',
    'Mua Hàng Online': 'shopping-cart',
    'Ăn Uống': 'utensils',
    'Thú Cưng': 'paw',
    'Khác' : 'ellipsis-h',
    // Add more descriptions and icons as needed...
  };

  const colorMap = {
    'Mua Sắm': '#ffa07a',     // Light Salmon
    'Mua Hàng Online': '#ffcc5c', // Pastel Yellow
    'Ăn Uống': '#B0E0E6',      // Light Sky Blue
    'Thú Cưng': '#98fb98',     // Pale Green
    'Khác' : '#e0e0e0',
    // Add more descriptions and pastel colors as needed...
  };
  const descriptionOrder = [
    'Mua Sắm',
    'Mua Hàng Online',
    'Ăn Uống',
    'Thú Cưng',
    'Khác',
    // Add more descriptions in the desired order...
  ];
  
  // Function to calculate the total amount spent by month
  function calculateTotalAmountByMonth(month) {
    const totalAmountByMonth = {};
    for (const expense of expensesData) {
      const expenseMonth = expense.date.substring(0, 7); // Extract the month part (e.g., '2023-07')
      if (expenseMonth === month) {
        if (!totalAmountByMonth[month]) {
          totalAmountByMonth[month] = [];
        }
        totalAmountByMonth[month].push(expense);
      }
    }
    return totalAmountByMonth;
  }
  const handleOpenBudgetModal = () => {
    setShowBudgetModal(true);
  };

  // Function to handle updating the budget threshold
  const handleUpdateBudget = (newBudget) => {
    AsyncStorage.setItem('budgetThreshold', String(newBudget));
    setBudgetThreshold(newBudget);
  };
   // Function to get the current month in 'YYYY-MM' format
   function getCurrentMonth() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // Function to handle switching to the previous month
  function handlePreviousMonth() {
    LayoutAnimation.configureNext(customAnimationConfig);
    const prevDate = new Date(currentMonth);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevMonth = prevDate.toISOString().substring(0, 7);
    setCurrentMonth(prevMonth);
  }

  // Function to handle switching to the next month
  function handleNextMonth() {
    LayoutAnimation.configureNext(customAnimationConfig);
    const nextDate = new Date(currentMonth);
    nextDate.setMonth(nextDate.getMonth() + 1);
    const nextMonth = nextDate.toISOString().substring(0, 7);
    setCurrentMonth(nextMonth);
  }

  // Function to format the amount with "." as a thousand separator and add "đ" for VND
  function formatAmount(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }
  const filterAndSortExpenses = () => {
    const filteredAndSortedExpenses = expensesData
      .filter((expense) => expense.date.substring(0, 7) === currentMonth)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    
    setFilteredExpenses(filteredAndSortedExpenses);
  };
  function calculateTotalAmountByDay(day) {
    let totalAmountByDay = 0;
    for (const expense of expensesData) {
      if (expense.date === day) {
        totalAmountByDay += expense.amount;
      }
    }
    return totalAmountByDay;
  }  

  const renderItem = ({ item, index }) => {
    const isSameDateAsPrevious = index > 0 && filteredExpenses[index - 1].date === item.date;
    const isSameDateAsNext = index < filteredExpenses.length - 1 && filteredExpenses[index + 1].date === item.date;
    const isFirstExpenseOnSameDate = !isSameDateAsPrevious;
    const isLastExpenseOnSameDate = !isSameDateAsNext;
    const isLastItem = index === filteredExpenses.length - 1;
  
    return (
      <>
        {isFirstExpenseOnSameDate && (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setExpandedDates((prevExpandedDates) =>
                prevExpandedDates.includes(item.date)
                  ? prevExpandedDates.filter((date) => date !== item.date)
                  : [item.date, ...prevExpandedDates]
              );
            }}
          >
            <View style={styles.dateHeader}>
              <Icon
                  name={expandedDates.includes(item.date) ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#000"
                  style={styles.arrowIcon}
                />
              <Text style={styles.expenseDateTitle}>{formatDate(item.date)}</Text>
               <Text style={styles.todayTotalAmount}>
                -{formatAmount(calculateTotalAmountByDay(item.date))}
                </Text>
            </View>
            {!expandedDates.includes(item.date) && <View style={styles.greyDot} />}
          </TouchableOpacity>
        )}
        {expandedDates.includes(item.date) && (
          <TouchableOpacity
            onLongPress={() => handleDeleteConfirmation(item.id)}
            style={[
              styles.expenseItem,
              {
                borderTopLeftRadius: isFirstExpenseOnSameDate ? 20 : 0,
                borderTopRightRadius: isFirstExpenseOnSameDate ? 20 : 0,
                borderBottomLeftRadius: isLastExpenseOnSameDate ? 20 : 0,
                borderBottomRightRadius: isLastExpenseOnSameDate ? 20 : 0,
              },
            ]}
            onPress={() => navigation.navigate('ExpenseDetailsScreen', { expense: item, handleUpdateExpense, handleDeleteExpense })}
          >
            <View style={styles.expenseInfoContainer}>
              <View style={styles.iconContainer}>
                <Icon name={iconMap[item.description]} size={22} color="#fff" style={styles.expenseIcon} />
              </View>
              <View style={styles.expenseDetailsContainer}>
              <Text style={styles.expenseTitle}>{item.title.charAt(0).toUpperCase() + item.title.slice(1)}</Text>
                <Text style={styles.expenseDescription}>{item.description}</Text>
              </View>
              <View>
                <Text style={styles.expenseAmount}>-{formatAmount(item.amount)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      {isLastItem && (
        <View style={styles.emptyEasterEggContainer}>
          <Icon name="paw" size={20} color="#ccc" />
          <Text style={styles.emptyTextEasterEgg}>Made by Orange with love</Text>
          <Text style={styles.emptyTextEasterEggVersion}>version 1.3.0</Text>
        </View>
      )}
      </>
    );
  };  
  
  // Function to format the date to "Today", "Yesterday", or dd/mm/yyyy
  function formatDate(date) {
    const currentDate = getCurrentDate();
    const [year, month, day] = date.split('-');
    const [currentYear, currentMonth, currentDay] = currentDate.split('-');

    if (date === currentDate) {
      return 'Hôm nay';
    } else if (
      parseInt(year, 10) === parseInt(currentYear, 10) &&
      parseInt(month, 10) === parseInt(currentMonth, 10) &&
      parseInt(day, 10) === parseInt(currentDay, 10) - 1
    ) {
      return 'Hôm qua';
    } else {
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    }
  }

  // Function to get the current date in 'YYYY-MM-DD' format
  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Function to calculate the total amount spent in an array of expenses
  function calculateTotalAmount(expenses) {
    let totalAmount = 0;
    for (const expense of expenses) {
      totalAmount += expense.amount;
    }
    return totalAmount;
  }
    // Add this function inside the MainScreen component, after the handleAddNewExpense function
  const handleUpdateExpense = async (updatedExpense) => {
    try {
      // Find the index of the expense to update in the expensesData array
      const expenseIndex = expensesData.findIndex((expense) => expense.id === updatedExpense.id);

      if (expenseIndex !== -1) {
        // Update the expense in the expensesData array
        const updatedExpenses = [...expensesData];
        updatedExpenses[expenseIndex] = updatedExpense;

        // Save the updated expenses to local storage
        await AsyncStorage.setItem('expensesData', JSON.stringify(updatedExpenses));

        // Update the expensesData state
        setExpensesData(updatedExpenses);
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  // Function to handle adding a new expense received from AddExpenseScreen
  const handleAddNewExpense = async (newExpense) => {
    try {
      // Save the new expense to local storage
      const savedExpenses = [...expensesData, newExpense];
      await AsyncStorage.setItem('expensesData', JSON.stringify(savedExpenses));

      // Update the expensesData state
      setExpensesData(savedExpenses);

      // Add the newly added expense date to the expandedDates state
      setExpandedDates((prevExpandedDates) => [newExpense.date, ...prevExpandedDates]);
    } catch (error) {
      console.error('Error saving new expense:', error);
    }
  };
  useEffect(() => {
    // Load the expenses data from local storage during the initial rendering
    const loadExpensesData = async () => {
      try {
        const expensesDataString = await AsyncStorage.getItem('expensesData');
        if (expensesDataString) {
          const loadedExpensesData = JSON.parse(expensesDataString);
          // Sort the loaded expenses data by date (descending order)
          loadedExpensesData.sort((a, b) => (a.date < b.date ? 1 : -1));
          setExpensesData(loadedExpensesData);
          setSortedExpenses(loadedExpensesData); // Set sortedExpenses initially

          // Initialize the expandedDates state with all unique dates from the loaded expenses data
          const allExpenseDates = loadedExpensesData.map((expense) => expense.date);
          setExpandedDates((prevExpandedDates) => {
            // Filter and keep only the unique dates present in both the current and loaded expenses data
            const uniqueDates = Array.from(new Set([...prevExpandedDates, ...allExpenseDates]));
            return uniqueDates;
          });
          const budgetThresholdString = await AsyncStorage.getItem('budgetThreshold');
          if (budgetThresholdString) {
            // Parse the loaded string as an integer and set it as the budgetThreshold
            const loadedBudgetThreshold = parseInt(budgetThresholdString);
            setBudgetThreshold(loadedBudgetThreshold);
          }
        }

        // Check if the modal flag is set
        const modalShown = await AsyncStorage.getItem('modalShown');

        // If the modal has not been shown before, set the flag to true and show the modal
        if (!modalShown) {
          await AsyncStorage.setItem('modalShown', 'true');
        }
      } catch (error) {
        console.error('Error loading expenses data:', error);
      }
    };

    loadExpensesData();
  }, []);
  
  useEffect(() => {
    if (expenseId) {
      handleDeleteExpense(expenseId);
    }
  }, [expenseId]);

  useEffect(() => {
    const checkAndScheduleNotification = async () => {
      try {
        const budgetThresholdString = await AsyncStorage.getItem('budgetThreshold');

        // If there's a value in AsyncStorage, use it; otherwise, use the default value
        const loadedBudgetThreshold = budgetThresholdString
          ? parseInt(budgetThresholdString)
          : 4000000; // Use the default value if there's no value in AsyncStorage
        
        setBudgetThreshold(loadedBudgetThreshold); // Update the budgetThreshold state
        
        const totalAmount = calculateTotalAmount(expensesData);
        if (totalAmount >= loadedBudgetThreshold && !notificationShown) {
          schedulePushNotification();
          setNotificationShown(true);
        }
      } catch (error) {
        console.error('Error checking and scheduling notification:', error);
      }
    };
  
    // Call the function to check and schedule the notification
    checkAndScheduleNotification();
  }, [expensesData, notificationShown]);
  

  useEffect(() => {
    filterAndSortExpenses();
  }, [expensesData, expandedDates, currentMonth]);
  
  // Function to format the current month as "mm/yyyy"
  function formatMonth(date) {
    const [year, month] = date.split('-');
    return `${month}/${year}`;
  }

  // Function to check if the filteredExpenses array is empty
  function hasExpensesData() {
     return filteredExpenses.length > 0;
  }
  function calculateTotalAmountByDescription(month) {
    const totalAmountByDescription = {};
    let totalAmountSpent = 0;
  
    for (const expense of expensesData) {
      const expenseMonth = expense.date.substring(0, 7);
      if (expenseMonth === month) {
        if (!totalAmountByDescription[expense.description]) {
          totalAmountByDescription[expense.description] = 0;
        }
        totalAmountByDescription[expense.description] += expense.amount;
        totalAmountSpent += expense.amount;
      }
    }
  
    // Get all unique descriptions in the expensesData array
    const uniqueDescriptions = Array.from(new Set(expensesData.map((expense) => expense.description)));
  
    // Sort the unique descriptions based on their index in the descriptionOrder array
    const sortedDescriptionOrder = uniqueDescriptions.sort(
      (a, b) => descriptionOrder.indexOf(a) - descriptionOrder.indexOf(b)
    );
  
    return { totalAmountByDescription, totalAmountSpent, sortedDescriptions: sortedDescriptionOrder };
  }  

  // Function to handle FAB press
  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.timing(fabAnimation, {
        toValue: 1,
        duration: 20,
        useNativeDriver: true,
      }),
      Animated.timing(fabAnimation, {
        toValue: 0,
        duration: 50,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      navigation.navigate('AddExpenseScreen', { handleAddNewExpense });
    });
  };
  // Function to send a notification when the total amount exceeds 4,000,000 VND
  async function schedulePushNotification() {
    const customIconUri = '/Users/huyphan/spendingManage/assets/adaptive-icon.png';
    // Define the threshold for triggering the notification
    const notificationThreshold = budgetThreshold; // Update this line
  
    // Calculate the total expenses for the current month
    const currentMonthExpenses = expensesData.filter((expense) => {
      const expenseMonth = expense.date.substring(0, 7);
      return expenseMonth === currentMonth;
    });
  
    const totalAmountForCurrentMonth = calculateTotalAmount(currentMonthExpenses);
  
    // Check if the total amount for the current month exceeds the threshold
    if (totalAmountForCurrentMonth >= notificationThreshold) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Vượt Quá Chi Tiêu Tháng 🚨",
          body: 'Bạn đã sử dụng vượt chi tiêu tháng này!',
          icon: customIconUri,
        },
        trigger: null, 
        ios: {
          sound: true, // Enable sound for iOS notifications
          _displayInForeground: true, // Show notification when the app is in the foreground (iOS 15+)
        },
        android: {
          channelId: 'default', // Required for Android notifications
          sound: true, // Enable sound for Android notifications
          priority: Notifications.AndroidNotificationPriority.HIGH, // Set notification priority (optional)
          vibrate: [0, 250, 250, 250], // Set vibration pattern (optional)
          color: '#FF231F7C', // Set notification color (optional)
        },
      });
    }
  }
  

  const handleDeleteExpense = async (expenseId) => {
    try {
      const updatedExpenses = expensesData.filter((expense) => expense.id !== expenseId);
      setSortedExpenses(updatedExpenses);

      await AsyncStorage.setItem('expensesData', JSON.stringify(updatedExpenses));

      setExpensesData(updatedExpenses);

      setShowDeleteModal(false);
      LayoutAnimation.configureNext(customAnimationConfig);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Function to display the delete confirmation modal
  const handleDeleteConfirmation = (expenseId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Find the expense to delete based on the ID
    const expenseToDelete = expensesData.find((expense) => expense.id === expenseId);

    // Set the selected expense to delete
    setExpenseToDelete(expenseToDelete);

    // Show the delete confirmation modal
    setShowDeleteModal(true);
  };

  // Function to handle canceling the delete action
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

    const { totalAmountByDescription, totalAmountSpent, sortedDescriptions } = calculateTotalAmountByDescription(
      currentMonth
    );

    const totalBudget = budgetThreshold;
    const segmentWidths = {};
    for (const description of sortedDescriptions) {
      const totalAmountSpentForDescription = totalAmountByDescription[description];
      const percentage = (totalAmountSpentForDescription / totalBudget) * 100;
      segmentWidths[description] = percentage;
    }

    const segmentPositions = {};
    let currentLeft = 0;

    for (const description of sortedDescriptions) {
      const widthPercentage = segmentWidths[description];
      segmentPositions[description] = currentLeft;
      currentLeft += widthPercentage;
    }
    const sortedDescriptionOrder = descriptionOrder;

    return (
      <View style={styles.container}>
         <View style={styles.summaryBox}>
         <View style={styles.navigationContainer}>
            <TouchableOpacity onPress={handlePreviousMonth}>
            <Icon name="chevron-left" style={styles.navigationArrow} />
            </TouchableOpacity>
            <Text style={styles.navigationMonth}>{formatMonth(currentMonth)}</Text>
            <TouchableOpacity onPress={handleNextMonth}>
            <Icon name="chevron-right" style={styles.navigationArrow} />
            </TouchableOpacity>
          </View>
          {Object.entries(totalAmountByMonth).map(([month, expenses]) => (
            <View key={month} style={styles.summaryItem}>
              <Text style={styles.totalAmount}>
                {expenses.length > 0
                  ? formatAmount(calculateTotalAmount(expenses))
                  : 'N/A'}
              </Text>
              <TouchableOpacity onPress={handleOpenBudgetModal}>
              <View style={styles.totalBudgetContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.totalBudgeText}t>
                    / {formatAmount(budgetThreshold)}
                  </Text> 
                  <View style={styles.totalBudgetIcon} >
                    <Icon name="pen" size={10} color="#fff"/>
                  </View>
                </View>
              </View>
              </TouchableOpacity>
              {!isScrolling && (
                <View style={styles.progressBar}>
                  {sortedDescriptions.map((description) => (
                    <View
                      key={description}
                      style={{
                        left: `${segmentPositions[description]}%`,
                        width: `${segmentWidths[description]}%`,
                        backgroundColor: colorMap[description] || '#ccc',
                        height: '100%',
                        position: 'absolute',
                      }}
                    />
                  ))}
                </View>
              )}
              {!isScrolling && (
                <View style={styles.dotContainer}>
                  <View style={styles.dotItemsWrapper}>
                    {sortedDescriptionOrder.map((description) => (
                      <View key={description} style={styles.dotItem}>
                        <View
                          style={[styles.dot, { backgroundColor: colorMap[description] || '#ccc' }]}
                        />
                        <Icon name={iconMap[description]} style={styles.dotIcon} />
                      </View>
                    ))}
                  </View>
                </View>
              )}

          </View>
          ))}
        </View>
        {hasExpensesData() ? (
          <View style={styles.expenseItemContainer}>
            <FlashList
              data={filteredExpenses}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={868}
              onMomentumScrollEnd={(event) => {
                const yOffset = event.nativeEvent.contentOffset.y;
                if (yOffset > scrollThreshold) {
                  setIsScrolling(true);
                  LayoutAnimation.configureNext(customAnimationConfig);
                } else {
                  setIsScrolling(false);
                  LayoutAnimation.configureNext(customAnimationConfig);
                }
              }}
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="piggy-bank" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Chi tiêu trống</Text>
            {/* <Text style={styles.emptyText1}>cho tháng này!</Text> */}
          </View>
        )}
        {/* Render the delete confirmation modal */}
        <DeleteConfirmationModal
          isVisible={showDeleteModal}
          expense={expenseToDelete}
          onCancel={handleCancelDelete}
          onDelete={handleDeleteExpense}
        />
         <BudgetInputModal
        isVisible={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSubmit={handleUpdateBudget}
        onCancel={() => setShowBudgetModal(false)} 
        />
          <Animated.View
            style={[
              styles.fabContainer,
              {
                transform: [
                  {
                    scale: fabAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.9],
                    }),
                  },
                ],
              },
            ]}
          >
            <FAB
              style={styles.fab}
              icon={({ size, color }) => (
                <Icon
                  name="plus"
                  size={size}
                  color={color}
                  style={{ alignSelf: 'center', textAlign: 'center' }}
                />
              )}
              color="#fff" // Change the color to white
              onPress={handleFabPress}
            />
          </Animated.View>
      </View>
    );
};    

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 5,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  navigationArrow: {
    padding: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF', // Change the color to whiteđ
    marginVertical: 5,

  },
  navigationMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // Change the color to white
  },
  summaryBox: {
    backgroundColor: '#8FCB8F',
    paddingVertical: 16,
    borderRadius: 20,
  },
  summaryItem: {
    flexDirection: 'column', // Change to 'column' instead of 'row'
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressBar: {
    width: '90%', // Make the progress bar occupy the full width
    height: 10,
    backgroundColor: 'rgba(242, 242, 242, 0.8)', // 50% opacity
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 5,
  },
  totalBudgetContainer: {
    // width: '90%',
    backgroundColor: 'rgba(242, 242, 242, 0.4)', // 50% opacity
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
   
  },
  totalBudgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
  },
  totalBudgetIcon:{
  
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    alignItems: 'center',
    marginTop: 10,
    // marginBottom: 15,
  },
  expenseItemContainer:{
    flex: 1,
    marginTop: 10,
  },
  expenseItem: {
    backgroundColor: '#fff', 
    padding: 16,
    marginBottom: 5,
  },
  expenseInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseIcon: {
    color: '#fff',
  },
  expenseDetailsContainer: {
    flex: 1,
    marginRight: 10, // Add some margin to the right of the title and description
  },
  iconContainer: {
    backgroundColor: '#8FCB8F',
    width: 50, // Set the width to make it a square
    height: 50, // Set the height to make it a square
    borderRadius: 15,
    padding: 12,
    marginRight: 15, // Add some margin to the right of the icon container
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  expenseTitle: {
    fontSize: 18,
    color: '#8FCB8F',
    fontWeight: 'bold',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
    fontWeight: 'bold',
  },
  expenseDate: {
    fontSize: 14,
    color: '#999',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  dateHeader: {
    marginTop: 18,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  arrowIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    alignSelf: 'center',
    marginRight: 10,
  },

  expenseDateTitle: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 4,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 15,
    shadowColor: '#8FCB8F',
  },
  fab: {
    borderRadius: 30,
    // shadowColor: "#8FCB8F",
    backgroundColor: '#88CC88',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEasterEggContainer:{
    marginTop: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
    marginTop: 10,
  },
  emptyText1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
  },
  emptyTextEasterEgg: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ccc',
    marginTop: 10,
  },
  emptyTextEasterEggVersion: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ccc',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dotItemsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    width: '80%', 
  },
  dotItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 10,
  },
  dotIcon: {
    fontSize: 15,
    color: '#fff',
  },
  greyDot: {
    width: '100%',
    height: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'center',

  },
  todayTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#999',
    marginLeft: 'auto', // Align to the right
  },  
});

export default MainScreen;