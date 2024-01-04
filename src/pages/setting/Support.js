import React from "react";
import "./support.css";
const Support = () => {
  return (
    <>

      <div className="support-section">
        <h4 className="support-section-heading">Support</h4>
        <div className="support-div-data-main-section">
          <div className="accordion accordion-flush" id="accordionExample">
            {/* Discovery */}
            <div className="accordion-item mb-3 mt-4" >
              <h2 className="accordion-header" id="head-one">
                <button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#d1" aria-expanded="false" aria-controls="d1">
                  <h5 className="">Discovery</h5>
                </button>
              </h2>
              <div id="d1" className="accordion-collapse collapse" aria-labelledby="head-one" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className="support-div-data-inner-data">
                    <p className="support-div-data-main-content">
                      Discovery is designed for people to gain insights from others and network globally, you can choose to
                      post/view photos, videos and comments. Discovery serves as the central hub of insights for VestorGrow.
                    </p>
                    <div className="support-div-data-inner">
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Photos, Videos and Comments</h6>
                        <p className="support-div-data-inner-data-content">
                          You can upload all forms of media onto the discovery by simply creating a post and setting it to public,
                          this will make your post appear within the discovery where it will become visible globally.
                        </p>
                      </div>
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Trending/Recent filtering</h6>
                        <p className="support-div-data-inner-data-content">
                          You have a choice to filter posts either based on their popularity or how recent they are. We base
                          trending posts off several factors primarily being: User engagement and activity within that post.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Profile */}
            <div className="accordion-item mb-3">
              <h2 className="accordion-header" id="head-two">
                <button className="accordion-button collapsed accordion-border" type="button" data-bs-toggle="collapse" data-bs-target="#d2" aria-expanded="false" aria-controls="d2">
                  <h5 className="">Profile</h5>
                </button>
              </h2>
              <div id="d2" className="accordion-collapse collapse" aria-labelledby="head-two" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <p className="support-div-data-main-content">
                    Your profile page is located on the left navigation bar, here you can manage your details for others to see,
                    you also can see your posting history.
                  </p>
                  <div className="support-div-data-inner">
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Profile Picture</h6>
                      <p className="support-div-data-inner-data-content">
                        To change your profile picture, click on <span>‘My Profile’</span> located on the left side of your
                        screen. Once here click on the <span>‘Camera’</span> icon to access your images.
                      </p>
                    </div>
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Banner Picture</h6>
                      <p className="support-div-data-inner-data-content">
                        To change your banner picture click on <span>‘My Profile’</span> located on the left side of your
                        screen. Once here click on the <span>‘Camera’</span> icon to the right of your banner image.
                      </p>
                    </div>
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Bio</h6>
                      <p className="support-div-data-inner-data-content">
                        To change your Bio click on <span>‘My Profile’</span> located on the left side of your screen. Once here
                        click on the
                        <span> ‘About’</span> and then <span>‘Edit’</span> to create your bio.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Messages */}
            <div className="accordion-item mb-3" >
              <h2 className="accordion-header" id="head-three">
                <button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#d3" aria-expanded="false" aria-controls="d3">
                  <h5 className="">Messages</h5>
                </button>
              </h2>
              <div id="d3" className="accordion-collapse collapse" aria-labelledby="head-three" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className="support-div-data-main">
                    <p className="support-div-data-main-content">
                      VestorGrow offers several ways for users to message each other, this can be accessed from the chat display
                      box to the right of your home page.
                      <br />
                      <br />
                      Direct messaging, quick messaging, groups and premium chat:
                    </p>
                    <div className="support-div-data-inner">
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Direct Messaging</h6>
                        <p className="support-div-data-inner-data-content">
                          Direct Messaging Users can either access their messages from the left navigation bar or use the chat
                          display box located on the right side of your home screen .
                        </p>
                      </div>
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Groups</h6>
                        <p className="support-div-data-inner-data-content">
                          You can create your own group and set it to either public or private, to do so access the chat display
                          box on the right side of your home page. You can also search for groups based on your interests.
                        </p>
                      </div>
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Premium Chat</h6>
                        <p className="support-div-data-inner-data-content">
                          Premium chat is for users with an active subscription. Users can share and discuss topics live with
                          other premium users. This can also be located within the chat display box.{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Posting/Posts */}
            <div className="accordion-item mb-3" >
              <h2 className="accordion-header" id="head-four">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#d4" aria-expanded="false" aria-controls="d4">
                  <h5 className="">Posting/Posts</h5>
                </button>
              </h2>
              <div id="d4" className="accordion-collapse collapse" aria-labelledby="head-four" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <p className="support-div-data-main-content">
                    Users can post to either their followers or the public (Discovery)
                  </p>
                  <div className="support-div-data-inner">
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Public/Private</h6>
                      <p className="support-div-data-inner-data-content">
                        When creating a post you can either make it public or private. If a post is public it will display on
                        the Discovery and your home screen, if a post is set to followers only then this will only be visible on
                        their feeds within their home screen.
                      </p>
                    </div>
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Sharing</h6>
                      <p className="support-div-data-inner-data-content">
                        Any user can share another person's post simply by clicking on the share icon within that post. The user
                        can choose from a list of external sites they would like to share the post, this includes Facebook,
                        Twitter, Instagram, Email or the user can simply copy the Url link and share outside the platform.
                      </p>
                    </div>
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Images/Videos and Comments</h6>
                      <p className="support-div-data-inner-data-content">
                        When posting you can choose which type of media you would like to share with others.This can either be
                        in the form of: an Image/video or comment.
                      </p>
                    </div>
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Like,Comment and Share</h6>
                      <p className="support-div-data-inner-data-content">
                        In order to like a post simply, click on the heart icon within the post. To comment on a post, click the
                        comment icon within the post, this will drop down the comments section under the post. Sharing a post is
                        done by clicking on the share icon located within the post, this will then prompt you to choose how you
                        would like to share that post.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Learning */}
            {/* <div className="accordion-item mb-3 " >
              <h2 className="accordion-header" id="head-five">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#d5" aria-expanded="false" aria-controls="d5">
                  <h5 className="">Learning</h5>
                </button>
              </h2>
              <div id="d5" className="accordion-collapse collapse" aria-labelledby="head-five" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <p className="support-div-data-main-content">
                    Our learning area is designed to provide a coaching platform for people to expand both their knowledge and
                    skill set in their chosen areas of interests. VestorGrow is constantly seeking new coaches that can provide
                    value for its members.
                  </p>
                  <div className="support-div-data-inner">
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Coaches</h6>
                      <p className="support-div-data-inner-data-content">
                        All coaches are verified before they can submit any learning content to users. This is done under an
                        application process which will be further vetted to confirm skills, qualifications and earnings. In some
                        cases depending on the coaches declaration of their nominated skills or claims we will use a legal team
                        to further verify. Our primary goal is offering our members valuable and life changing content by
                        coaches who are experienced and qualified to assist.
                      </p>
                    </div>
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Video Content</h6>
                      <p className="support-div-data-inner-data-content">
                        All coaches must use video content in order to teach/inform members. This can be accessed from our
                        learning page located in the left navigation bar of the home screen.
                      </p>
                    </div>
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Webinars</h6>
                      <p className="support-div-data-inner-data-content">
                        Coaches are encouraged to host regular webinars to provide interaction and support to all members. All
                        webinars are recorded and stored within the learning page for users who may be unable to attend.{" "}
                      </p>
                    </div>
                    <div className="support-div-data-inner-data">
                      <h6 className="support-div-data-inner-data-heading">Resources</h6>
                      <p className="support-div-data-inner-data-content">
                        We are constantly uploading resources to our learning page to further assist users in their journey of
                        development.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Settings */}
            <div className="accordion-item mb-3" >
              <h2 className="accordion-header" id="head-six">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#d6" aria-expanded="false" aria-controls="d6">
                  <h5 className="">Settings</h5>
                </button>
              </h2>
              <div id="d6" className="accordion-collapse collapse" aria-labelledby="head-six" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className="support-div-data-main">
                    <p className="support-div-data-main-content">
                      Access your settings from the left navigation bar to manage or make account related changes.
                    </p>
                    <div className="support-div-data-inner">
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Account Settings</h6>
                        <p className="support-div-data-inner-data-content">
                          Edit your account settings: Username, email and password.
                        </p>
                      </div>
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Account Billing</h6>
                        <p className="support-div-data-inner-data-content">
                          Access your billing information and make any changes to your account.
                        </p>
                      </div>
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Blocking</h6>
                        <p className="support-div-data-inner-data-content">You can search and block/unblock any user</p>
                      </div>
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Privacy</h6>
                        <p className="support-div-data-inner-data-content">
                          Set your account to either public or private. This will change the way in which people can interact with
                          you, if your account is set to private then users would have to request if they would like to follow
                          you, whereas if your profile is set to public, then anyone can follow you without you having to approve
                          them.
                        </p>
                      </div>
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Email Verification</h6>
                        <p className="support-div-data-inner-data-content">
                          Enable email verification to further safeguard your profile.
                        </p>
                      </div>
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Session History</h6>
                        <p className="support-div-data-inner-data-content">
                          This will provide you with a list of machines that your account has been accessed from, you remove
                          access to machines that you are not familiar with.
                        </p>
                      </div>
                      <div className="support-div-data-inner-data">
                        <h6 className="support-div-data-inner-data-heading">Delete Account</h6>
                        <p className="support-div-data-inner-data-content">
                          If you feel the need to delete your account please contact us to see how we can assist you. If you would
                          like to delete your account then simply click the <span>‘Delete’</span> and your account will be removed
                          from our system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Refunds */}
            {/* <div className="accordion-item mb-3 " >
              <h2 className="accordion-header" id="head-seven">
                <button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#d7" aria-expanded="false" aria-controls="d7">
                  <h5 className="">Refunds</h5>
                </button>
              </h2>
              <div id="d7" className="accordion-collapse collapse" aria-labelledby="head-seven" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className="support-div-data-main">
                    <p className="support-div-data-main-content">
                      Whilst we have a non refund policy in place we are happy to discuss this on a case by case basis. Please
                      email
                      <a href="#"> hello@vestorgrow.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Reporting */}
            <div className="accordion-item mb-3 " >
              <h2 className="accordion-header" id="head-eight">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#d8" aria-expanded="false" aria-controls="d8">
                  <h5 className="">Reporting</h5>
                </button>
              </h2>
              <div id="d8" className="accordion-collapse collapse" aria-labelledby="head-eight" data-bs-parent="#accordionExample">
                <div className="accordion-body">
                  <div className="support-div-data-main">
                    <p className="support-div-data-main-content">
                      All users and posts have a report feature which will instantly flag on our systems for admins to look into.
                      We encourage users to report anyone or content they believe to not be the VestorGrow way.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Support;
