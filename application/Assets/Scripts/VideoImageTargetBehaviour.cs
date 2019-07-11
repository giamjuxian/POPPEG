using UnityEngine;
using EasyAR;
using UnityEngine.Video;
using static NativeGallery;
using System.Collections.Generic;

public class VideoImageTargetBehaviour : ImageTargetBehaviour
{
    private const float X_VIDEO_ROTATION = 90;
    private const float VIDEO_SCALING = 1.15f;
    private string previousTarget;
    private VideoPlayer previousPlayer;
    private Dictionary<string, double> timeStamps;
    private double videoTime;

    protected override void Awake()
    {
        base.Awake();
        TargetFound += OnTargetFound;
        TargetLost += OnTargetLost;
        TargetLoad += OnTargetLoad;
        TargetUnload += OnTargetUnload;
        timeStamps = new Dictionary<string, double>();
    }

    protected override void Update()
    {
        videoTime = previousPlayer.time;
    }

    void OnTargetFound(TargetAbstractBehaviour behaviour)
    {
        Debug.Log("Found: " + Target.Id + " (" + Target.Name + ")");

        if (previousTarget != Target.Name)
        {
            previousTarget = Target.Name;
            var videoComponents = GetComponentsInChildren<VideoPlayer>(true);
            foreach (var component in videoComponents)
            {
                string videoURL = Application.persistentDataPath + "/" + Target.Name + ".mp4";
                if (System.IO.File.Exists(videoURL))
                {
                    component.targetTexture = new RenderTexture(1, 1, 0);
                    component.source = VideoSource.Url;
                    component.url = videoURL;
                    VideoProperties videoProperties = GetVideoProperties(component.url);
                    component.Prepare();
                    previousPlayer = component;
                    component.prepareCompleted += (VideoPlayer source) =>
                    {
                        previousTarget = Target.Name;
                        float videoWidth = source.texture.width;
                        float videoHeight = source.texture.height;
                        Debug.Log("Rotation: " + videoProperties.rotation);
                        component.transform.localScale = new Vector3(videoWidth / Mathf.Max(videoWidth, videoHeight) * VIDEO_SCALING,
                            videoHeight / Mathf.Max(videoWidth, videoHeight) * VIDEO_SCALING, 1f);
                        component.transform.rotation = Quaternion.Euler(X_VIDEO_ROTATION, 0, -1 * videoProperties.rotation); // Lay the video flat
                        component.Play();
                        if (timeStamps.ContainsKey(Target.Name))
                        {
                            component.time = timeStamps[previousTarget];
                        }
                    };
                    Debug.Log("Playing from: " + Application.persistentDataPath + "/" + Target.Name + ".mp4");
                }
                else
                {
                    Debug.Log("File does not exists");
                }
            }
        }
        else
        {
            previousPlayer.Play();
            previousPlayer.time = videoTime;
        }

    }

    void OnTargetLost(TargetAbstractBehaviour behaviour)
    {
        Debug.Log("Lost: " + Target.Id + " (" + Target.Name + ")");
        if (timeStamps.ContainsKey(previousTarget))
        {
            timeStamps[previousTarget] = videoTime;
        }
        else
        {
            timeStamps.Add(previousTarget, videoTime);
        }
    }

    void OnTargetLoad(ImageTargetBaseBehaviour behaviour, ImageTrackerBaseBehaviour tracker, bool status)
    {
        Debug.Log("Load target (" + status + "): " + Target.Id + " (" + Target.Name + ") " + " -> " + tracker);
    }

    void OnTargetUnload(ImageTargetBaseBehaviour behaviour, ImageTrackerBaseBehaviour tracker, bool status)
    {
        Debug.Log("Unload target (" + status + "): " + Target.Id + " (" + Target.Name + ") " + " -> " + tracker);
    }
}