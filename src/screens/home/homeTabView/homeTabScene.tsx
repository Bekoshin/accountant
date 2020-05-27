import React, {useEffect, useState, memo} from 'react';
import Operation from '../../../entities/Operation';
import {convertDate, getMonthName} from '../../../utils/DateUtils';
import I18n from '../../../i18n/i18n';
import {List} from 'react-native-paper';
import {GestureResponderEvent, ScrollView, Text, View} from 'react-native';
import {NoExpensesComponent} from '../../../components/noExpenses/noExpenses.Component';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  formatNumberToDecimal,
  groupByCategory,
  groupByDate,
  groupByMonth,
} from '../../../utils/OperationUtils';
import {DATE, GroupedBy, UnitOfDate} from '../home.component';

type HomeTabSceneProps = {
  tabLabel: string;
  operations: Operation[];
  groupedBy: GroupedBy;
  unitOfDate: UnitOfDate;

  onOperationPress: (operation: Operation) => void;
  onOperationLongPress: (
    operation: Operation,
    anchor: {x: number; y: number},
  ) => void;
};

const HomeTabScene = (props: HomeTabSceneProps) => {
  const {
    operations,
    groupedBy,
    unitOfDate,
    onOperationPress,
    onOperationLongPress,
  } = props;

  const [operationMap, setOperationMap] = useState(
    createOperationMap(operations, unitOfDate, groupedBy),
  );

  useEffect(() => {
    const newOperationMap = createOperationMap(
      operations,
      unitOfDate,
      groupedBy,
    );
    setOperationMap(newOperationMap);
  }, [groupedBy, operations, unitOfDate]);

  const renderOperationSections = () => {
    let operationComponents: any[] = [];
    operationMap.forEach((tempOperations: Operation[]) => {
      if (tempOperations.length > 0) {
        let key;
        let subheader;
        if (groupedBy === 'date') {
          if (unitOfDate === 'year') {
            key = tempOperations[0].date.toString();
            subheader = getMonthName(tempOperations[0].date);
          } else {
            key = tempOperations[0].date.toString();
            subheader = convertDate(tempOperations[0].date);
          }
        } else {
          key = tempOperations[0].category.id;
          subheader = I18n.t(tempOperations[0].category.name, {
            defaultValue: tempOperations[0].category.name,
          });
        }
        operationComponents.push(
          <List.Section key={key}>
            <List.Subheader>{subheader}</List.Subheader>
            {renderOperations(tempOperations)}
          </List.Section>,
        );
      }
    });

    if (operationComponents.length > 0) {
      return (
        <ScrollView contentContainerStyle={{paddingBottom: 60}}>
          {operationComponents}
        </ScrollView>
      );
    } else {
      return <NoExpensesComponent />;
    }
  };

  const renderOperations = (groupedOperations: Operation[]) => {
    let operationComponents = [];
    for (let operation of groupedOperations) {
      let title;
      if (groupedBy === 'date') {
        title = I18n.t(operation.category.name, {
          defaultValue: operation.category.name,
        });
      } else {
        title = convertDate(operation.date);
      }
      operationComponents.push(
        <List.Item
          key={operation.id}
          title={title}
          onPress={() => onOperationPress(operation)}
          onLongPress={
            ((evt: GestureResponderEvent) => {
              const x = evt.nativeEvent.pageX;
              const y = evt.nativeEvent.pageY;
              onOperationLongPress(operation, {x: x, y: y});
            }) as () => void
          }
          left={
            operation.category.iconName
              ? () => (
                  <Icon
                    name={operation.category.iconName as string}
                    size={48}
                    color="black"
                  />
                )
              : undefined
          }
          right={() => (
            <View style={{justifyContent: 'center'}}>
              <Text>{formatNumberToDecimal(operation.amount)} ₽</Text>
            </View>
          )}
        />,
      );
    }
    return operationComponents;
  };

  console.log('scene render');
  return <View style={{flex: 1}}>{renderOperationSections()}</View>;
};

const createOperationMap = (
  operations: Operation[],
  unitOfDate: UnitOfDate,
  attribute: GroupedBy,
): Map<string, Operation[]> => {
  let operationMap: Map<string, Operation[]>;
  if (attribute === DATE) {
    if (unitOfDate === 'year') {
      operationMap = groupByMonth(operations);
    } else {
      operationMap = groupByDate(operations);
    }
  } else {
    operationMap = groupByCategory(operations) as Map<string, Operation[]>;
  }
  return operationMap;
};

export default memo(HomeTabScene);
