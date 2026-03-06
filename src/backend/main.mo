import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";

actor {
  type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type DailyAnalytics = {
    date : Text;
    visitorCount : Nat;
    toolUsage : [ToolUsage];
  };

  type ToolUsage = {
    toolName : Text;
    usageCount : Nat;
  };

  type BlogPost = {
    title : Text;
    content : Text;
    author : Text;
    date : Text;
    category : Text;
    relatedTools : [Text];
  };

  module BlogPost {
    public func compareByDate(a : BlogPost, b : BlogPost) : Order.Order {
      Text.compare(a.date, b.date);
    };
  };

  let contactMessages = List.empty<ContactMessage>();
  let dailyAnalytics = Map.empty<Text, DailyAnalytics>();
  let blogPosts = List.empty<BlogPost>();
  var totalVisitors = 0;

  public shared ({ caller }) func addContactMessage(name : Text, email : Text, message : Text) : async () {
    let newMessage : ContactMessage = {
      name;
      email;
      message;
      timestamp = Time.now();
    };
    contactMessages.add(newMessage);
  };

  public shared ({ caller }) func updateAnalytics(date : Text, toolName : Text) : async () {
    totalVisitors += 1;
    let currentDay = switch (dailyAnalytics.get(date)) {
      case (null) {
        {
          date;
          visitorCount = 1;
          toolUsage = [{
            toolName;
            usageCount = 1;
          }];
        };
      };
      case (?day) {
        {
          date;
          visitorCount = day.visitorCount + 1;
          toolUsage = updateToolUsage(day.toolUsage, toolName);
        };
      };
    };
    dailyAnalytics.add(date, currentDay);
  };

  func updateToolUsage(toolUsage : [ToolUsage], toolName : Text) : [ToolUsage] {
    let existingTool = toolUsage.find(func(t) { t.toolName == toolName });
    switch (existingTool) {
      case (null) {
        toolUsage.concat([{
          toolName;
          usageCount = 1;
        }]);
      };
      case (?tool) {
        toolUsage.map(
          func(t) {
            if (t.toolName == toolName) {
              { toolName = t.toolName; usageCount = t.usageCount + 1 };
            } else {
              t;
            };
          }
        );
      };
    };
  };

  public query ({ caller }) func getDailyAnalytics(date : Text) : async DailyAnalytics {
    switch (dailyAnalytics.get(date)) {
      case (null) { Runtime.trap("No analytics for this date") };
      case (?stats) { stats };
    };
  };

  public shared ({ caller }) func addBlogPost(title : Text, content : Text, author : Text, date : Text, category : Text, relatedTools : [Text]) : async () {
    let newPost : BlogPost = {
      title;
      content;
      author;
      date;
      category;
      relatedTools;
    };
    blogPosts.add(newPost);
  };

  public query ({ caller }) func getBlogPostsByCategory(category : Text) : async [BlogPost] {
    blogPosts.toArray().filter(
      func(post) {
        post.category == category;
      }
    );
  };

  public query ({ caller }) func getBlogPostsSortedByDate() : async [BlogPost] {
    blogPosts.toArray().sort(BlogPost.compareByDate);
  };
};
