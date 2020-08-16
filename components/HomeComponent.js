import React, { Component } from 'react';
import {Text, View, Animated, Easing  } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
//step 9 navigator

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders
    }
  }
function RenderItem(props) {
    
        const item = props.item;

        if (props.isLoading) {
            return(
                    <Loading />
            );
        }
        else if (props.errMess) {
            return(
                <View> 
                    <Text>{props.erreMess}</Text>
                </View>
            );
        }
        else {        
            if (item != null) {
                return(
                    <Card
                        featuredTitle={item.name}
                        featuredSubtitle={item.designation}
                        image={{uri: baseUrl + item.image}}>
                        <Text
                            style={{margin: 10}}>
                            {item.description}</Text>
                    </Card>
                );
            }
            else {
                return(<View></View>);
            }
        }
        
}

class Home extends Component {

    constructor(props) {
        super(props);
        
         //-----animation step 1-----
        this.animatedValue = new Animated.Value(0);   
    }

    //-------animation step 2-------
    animate () {   
        this.animatedValue.setValue(0) //statrs val
        Animated.timing(
          this.animatedValue,
          {
            toValue: 8,                 //end val
            duration: 8000,
            easing: Easing.linear
          }
        ).start(() => this.animate()) //again calling animate fucntion by ending animation
    }

    componentDidMount () {
        this.animate()
    }

    static navigationOptions = {
        title: 'Home',
    };

    render() {
        
        //-------animation step 3-------

        //defining X-axis positions
        const xpos1 = this.animatedValue.interpolate({
            inputRange: [0, 1, 3, 5, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        })
        const xpos2 = this.animatedValue.interpolate({
            inputRange: [0, 2, 4, 6, 8],
            outputRange: [1200, 600, 0, -600, -1200]
        })
        const xpos3 = this.animatedValue.interpolate({
            inputRange: [0, 3, 5, 7, 8],
            outputRange: [1200, 600, 0, -600, -1200 ]
        })

        return(

            //-------animation step 4-------
            //<View> and  Animated.View> is 4rth step

            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>

                <Animated.View style={{ width: '100%', transform: [{translateX: xpos1}]}}>
                    <RenderItem item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                    isLoading={this.props.dishes.isLoading}
                    erreMess={this.props.dishes.erreMess}  />
                </Animated.View>

                <Animated.View style={{ width: '100%',  transform: [{translateX: xpos2}]}}>
                    <RenderItem item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                    isLoading={this.props.promotions.isLoading}
                    erreMess={this.props.promotions.erreMess}  />
                </Animated.View> 

                <Animated.View style={{ width: '100%',  transform: [{translateX: xpos3}]}}>
                    <RenderItem item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
                    isLoading={this.props.leaders.isLoading}
                    erreMess={this.props.leaders.erreMess}  />
                </Animated.View> 

            </View>
        );
    }
}


export default connect(mapStateToProps)(Home);