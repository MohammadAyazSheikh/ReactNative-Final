import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes
    }
  }

class Menu extends Component {

    constructor(props) {
        super(props);
    }

    //step 4 naviga (for change the text of header)
    static navigationOptions = {
        title: 'Menu'
    };



    render(){

        const renderMenuItem = ({item, index}) => {

            return (
                <Animatable.View animation="fadeInRightBig" duration={2000}> 
                    <Tile
                    key={index}
                    title={item.name}
                    caption={item.description}
                    featured
                

                    //step 6 for navigation //next step in dishDetailComponent

                    onPress={() => navigate('Dishdetail'/*this is navigation name we define in MainComponent */, { dishId: item.id } /*this is parameter for navigation we are passing */)}
                    imageSrc={{ uri: baseUrl + item.image}}
                />
               </Animatable.View> 
            );
        };

         //step 5 for navigator
         const { navigate } = this.props.navigation;
         

         if (this.props.dishes.isLoading) {
            return(
                <Loading />
            );
        }
        else if (this.props.dishes.errMess) {
            return(
                <View>            
                    <Text>{this.props.dishes.errMess}</Text>
                </View>            
            );
        }
        else {
            return (
                <FlatList 
                    data={this.props.dishes.dishes}
                    renderItem={renderMenuItem}
                    keyExtractor={item => item.id.toString()}
                    />
            );
        }

    }
}

export default connect(mapStateToProps)(Menu);