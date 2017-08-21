import React, {PureComponent} from 'react';
import {View, Text, Button} from 'react-native';
import {
  ApolloProvider,
  ApolloClient,
  createNetworkInterface,
  gql,
  graphql,
  compose
} from 'react-apollo';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://graphql-demo.kriasoft.com'
  })
});

class App extends PureComponent {
  render() {
    console.log('props', this.props);

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button onPress={this.createStory} title="create story" />
        <Text>foobar</Text>
      </View>
    );
  }

  createStory = () => {
    this.props
      .createStory()
      .then(result => {
        console.log('result', result);
      })
      .catch(error => {
        const errors = JSON.parse(JSON.stringify(error));
        console.log('errors', errors);
      });
  };
}

const loadStories = graphql(gql`
  query {
    stories {
      edges {
        node {
          id
          title
          url
          text
          comments {
            id
            text
            story {
              id
              title
            }
          }
          pointsCount
          createdAt
        }
      }
      pageInfo {
        startCursor
        endCursor
      }
    }
  }
`);

const createStory = graphql(
  gql`
    mutation {
      createStory(input: {title: "foobar", text: "another article"}) {
        story {
          id
        }
      }
    }
  `,
  {name: 'createStory'}
);

const AppWithData = compose(createStory)(App);

export default () =>
  <ApolloProvider client={client}>
    <AppWithData />
  </ApolloProvider>;
